import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { formatUGX } from '@/utils/formatUGX';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  product_id?: string;
  created_at: string;
  is_read: boolean;
}

interface Conversation {
  other_user_id: string;
  product_id?: string;
  product_name?: string;
  product_image?: string;
  product_price?: number;
  last_message_time: string;
  unread_count: number;
  other_user?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

interface Product {
  id: string;
  name: string;
  price_ugx: number;
  product_images?: { image_url: string }[];
}

export default function Messages() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('product');
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Load product info if productId is provided
  useEffect(() => {
    if (productId && user) {
      loadProduct(productId);
    }
  }, [productId, user]);

  // Load conversations
  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadProduct = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          price_ugx,
          product_images (image_url)
        `)
        .eq('id', productId)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
    }
  };

  const loadConversations = async () => {
    try {
      // Get all conversations for the current user
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select(`
          sender_id,
          receiver_id,
          product_id,
          created_at,
          is_read,
          products!inner (
            name,
            price_ugx
          )
        `)
        .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by conversation (other_user + product)
      const conversationMap = new Map<string, any>();
      
      messagesData?.forEach((msg) => {
        const otherUserId = msg.sender_id === user?.id ? msg.receiver_id : msg.sender_id;
        const key = `${otherUserId}-${msg.product_id || 'general'}`;
        
        if (!conversationMap.has(key)) {
          conversationMap.set(key, {
            other_user_id: otherUserId,
            product_id: msg.product_id,
            product_name: msg.products?.name,
            product_price: msg.products?.price_ugx,
            last_message_time: msg.created_at,
            unread_count: 0
          });
        }

        // Count unread messages
        if (msg.receiver_id === user?.id && !msg.is_read) {
          conversationMap.get(key).unread_count++;
        }
      });

      const conversationsList = Array.from(conversationMap.values());

      // Get profile info for other users
      const otherUserIds = conversationsList.map(c => c.other_user_id);
      if (otherUserIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url')
          .in('id', otherUserIds);

        conversationsList.forEach(conv => {
          const profile = profiles?.find(p => p.id === conv.other_user_id);
          if (profile) {
            conv.other_user = profile;
          }
        });
      }

      setConversations(conversationsList);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoadingConversations(false);
    }
  };

  const loadMessages = async (conversation: Conversation) => {
    setLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${conversation.other_user_id}),and(sender_id.eq.${conversation.other_user_id},receiver_id.eq.${user?.id})`)
        .eq('product_id', conversation.product_id || null)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('receiver_id', user?.id)
        .eq('sender_id', conversation.other_user_id);

      // Refresh conversations to update unread count
      loadConversations();
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          sender_id: user?.id,
          receiver_id: selectedConversation.other_user_id,
          product_id: selectedConversation.product_id,
          content: newMessage.trim()
        }]);

      if (error) throw error;

      setNewMessage('');
      loadMessages(selectedConversation);
      loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const startNewConversation = async () => {
    if (!product || !user) return;

    const adminUserId = 'admin-user-id'; // This should be replaced with actual admin user ID
    
    const newConversation: Conversation = {
      other_user_id: adminUserId,
      product_id: product.id,
      product_name: product.name,
      product_price: product.price_ugx,
      last_message_time: new Date().toISOString(),
      unread_count: 0,
      other_user: {
        first_name: 'Store',
        last_name: 'Admin'
      }
    };

    setSelectedConversation(newConversation);
    setMessages([]);
  };

  if (loading || loadingConversations) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
          {/* Conversations List */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Conversations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-20rem)]">
                {productId && product && !selectedConversation && (
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-blue-50 cursor-pointer" onClick={startNewConversation}>
                      <div className="w-12 h-12 bg-muted rounded overflow-hidden">
                        {product.product_images?.[0] && (
                          <img 
                            src={product.product_images[0].image_url} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Ask about this product</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{product.name}</p>
                        <p className="text-xs font-semibold text-blue-600">{formatUGX(product.price_ugx)}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {conversations.map((conversation) => (
                  <div
                    key={`${conversation.other_user_id}-${conversation.product_id}`}
                    className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${
                      selectedConversation?.other_user_id === conversation.other_user_id &&
                      selectedConversation?.product_id === conversation.product_id
                        ? 'bg-muted'
                        : ''
                    }`}
                    onClick={() => {
                      setSelectedConversation(conversation);
                      loadMessages(conversation);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.other_user?.avatar_url} />
                        <AvatarFallback>
                          {conversation.other_user ? 
                            `${conversation.other_user.first_name[0]}${conversation.other_user.last_name[0]}` :
                            'U'
                          }
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">
                            {conversation.other_user ? 
                              `${conversation.other_user.first_name} ${conversation.other_user.last_name}` :
                              'Unknown User'
                            }
                          </p>
                          {conversation.unread_count > 0 && (
                            <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                              {conversation.unread_count}
                            </Badge>
                          )}
                        </div>
                        {conversation.product_name && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            Re: {conversation.product_name}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {new Date(conversation.last_message_time).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {conversations.length === 0 && !productId && (
                  <div className="p-8 text-center text-muted-foreground">
                    <p>No conversations yet</p>
                    <p className="text-sm">Messages about products will appear here</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="col-span-2">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedConversation.other_user?.avatar_url} />
                      <AvatarFallback>
                        {selectedConversation.other_user ? 
                          `${selectedConversation.other_user.first_name[0]}${selectedConversation.other_user.last_name[0]}` :
                          'U'
                        }
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {selectedConversation.other_user ? 
                          `${selectedConversation.other_user.first_name} ${selectedConversation.other_user.last_name}` :
                          'Unknown User'
                        }
                      </CardTitle>
                      {selectedConversation.product_name && (
                        <p className="text-sm text-muted-foreground">
                          About: {selectedConversation.product_name}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>

                {/* Product Reference */}
                {selectedConversation.product_name && (
                  <div className="p-4 border-b bg-muted/30">
                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-background">
                      <div className="w-12 h-12 bg-muted rounded overflow-hidden">
                        {selectedConversation.product_image && (
                          <img 
                            src={selectedConversation.product_image} 
                            alt={selectedConversation.product_name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{selectedConversation.product_name}</p>
                        <p className="text-sm font-semibold text-green-600">
                          {formatUGX(selectedConversation.product_price || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Messages */}
                <CardContent className="p-0 flex-1">
                  <ScrollArea className="h-[calc(100vh-32rem)] p-4">
                    {loadingMessages ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-[70%] p-3 rounded-lg ${
                                message.sender_id === user?.id
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                message.sender_id === user?.id
                                  ? 'text-primary-foreground/70'
                                  : 'text-muted-foreground'
                              }`}>
                                {new Date(message.created_at).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          sendMessage();
                        }
                      }}
                    />
                    <Button onClick={sendMessage} disabled={sending}>
                      {sending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <p>Select a conversation to start messaging</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}