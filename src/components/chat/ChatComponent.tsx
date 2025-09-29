import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, MessageCircle, ExternalLink, MessageSquare, Bot } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { formatUGX } from '@/utils/formatUGX';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  product_id?: string;
  conversation_id?: string;
  is_read: boolean;
  message_type: string;
  read_at?: string;
  created_at: string;
  sender_profile?: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
}

interface Product {
  id: string;
  name: string;
  price_ugx: number;
  slug: string;
  status: string;
}

interface ChatComponentProps {
  productId: string;
  sellerId?: string;
  onClose?: () => void;
}

interface BotResponse {
  message: string;
  quickReplies?: string[];
}

export function ChatComponent({ productId, sellerId, onClose }: ChatComponentProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && productId) {
      initializeChat();
    }
  }, [user, productId, sellerId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (conversationId) {
      // Set up real-time subscription for new messages
      const channel = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`
          },
          (payload) => {
            const newMessage = payload.new as Message;
            setMessages(prev => [...prev, newMessage]);
            
            // Mark message as read if it's not from current user
            if (newMessage.sender_id !== user?.id) {
              markMessageAsRead(newMessage.id);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [conversationId, user?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = async () => {
    try {
      // Fetch product details
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('id, name, price_ugx, slug, status')
        .eq('id', productId)
        .single();

      if (productError) throw productError;
      setProduct(productData);

      // Find or create conversation
      let conversation;
      const { data: existingConversation, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('product_id', productId)
        .eq('buyer_id', user!.id)
        .maybeSingle();

      if (convError) throw convError;

      if (existingConversation) {
        conversation = existingConversation;
      } else {
        // Create new conversation
        const { data: newConversation, error: createError } = await supabase
          .from('conversations')
          .insert({
            product_id: productId,
            buyer_id: user!.id,
            seller_id: sellerId,
            status: 'active'
          })
          .select()
          .single();

        if (createError) throw createError;
        conversation = newConversation;
      }

      setConversationId(conversation.id);

      // Fetch existing messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          sender_profile:profiles!messages_sender_id_fkey(first_name, last_name, avatar_url)
        `)
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;
      setMessages(messagesData || []);

      // Mark unread messages as read
      const unreadMessages = messagesData?.filter(m => !m.is_read && m.sender_id !== user!.id) || [];
      for (const message of unreadMessages) {
        await markMessageAsRead(message.id);
      }

    } catch (error) {
      console.error('Error initializing chat:', error);
      toast.error('Failed to load chat');
    } finally {
      setLoading(false);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', messageId);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !conversationId || !user) return;

    setSending(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          content: newMessage,
          sender_id: user.id,
          receiver_id: sellerId || 'system',
          product_id: productId,
          conversation_id: conversationId,
          message_type: 'text'
        })
        .select(`
          *,
          sender_profile:profiles!messages_sender_id_fkey(first_name, last_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      setMessages(prev => [...prev, data]);
      setNewMessage('');

      // Check if message triggers bot response
      const botResponse = getBotResponse(newMessage);
      if (botResponse) {
        setTimeout(() => {
          sendBotMessage(botResponse);
        }, 1000);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const getBotResponse = (message: string): BotResponse | null => {
    const lowercaseMessage = message.toLowerCase();
    
    if (lowercaseMessage.includes('shipping') || lowercaseMessage.includes('delivery')) {
      return {
        message: "We offer delivery within Kampala and surrounding areas. Delivery takes 1-3 business days. Shipping costs vary by location.",
        quickReplies: ["What's the delivery cost?", "How long for delivery?", "Do you deliver outside Kampala?"]
      };
    }
    
    if (lowercaseMessage.includes('return') || lowercaseMessage.includes('refund')) {
      return {
        message: "We have a 7-day return policy for unused items in original packaging. Refunds are processed within 5-7 business days.",
        quickReplies: ["How to return an item?", "Refund process", "Return conditions"]
      };
    }
    
    if (lowercaseMessage.includes('payment') || lowercaseMessage.includes('pay')) {
      return {
        message: "We accept Mobile Money (MTN, Airtel), Bank transfers, and Cash on Delivery. All payments are secure.",
        quickReplies: ["Mobile Money details", "Bank account info", "Cash on delivery"]
      };
    }
    
    if (lowercaseMessage.includes('price') || lowercaseMessage.includes('cost') || lowercaseMessage.includes('discount')) {
      return {
        message: `This product costs ${formatUGX(product?.price_ugx || 0)}. We occasionally offer discounts - follow us for updates!`,
        quickReplies: ["Any current discounts?", "Bulk purchase discount", "Price negotiable?"]
      };
    }

    if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi') || lowercaseMessage.includes('help')) {
      return {
        message: "Hello! I'm here to help with any questions about this product. How can I assist you today?",
        quickReplies: ["Product details", "Shipping info", "Payment options", "Return policy"]
      };
    }

    return null;
  };

  const sendBotMessage = async (botResponse: BotResponse) => {
    if (!conversationId) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          content: botResponse.message,
          sender_id: 'bot',
          receiver_id: user!.id,
          product_id: productId,
          conversation_id: conversationId,
          message_type: 'bot'
        })
        .select()
        .single();

      if (error) throw error;

      setMessages(prev => [...prev, {
        ...data,
        sender_profile: {
          first_name: 'AfricaneFusion',
          last_name: 'Bot',
          avatar_url: null
        }
      }]);

    } catch (error) {
      console.error('Error sending bot message:', error);
    }
  };

  const sendQuickReply = (reply: string) => {
    setNewMessage(reply);
  };

  const openWhatsApp = () => {
    const phoneNumber = '+256700000000'; // Replace with actual seller phone
    const message = `Hi! I'm interested in your product: ${product?.name}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'U';
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Please log in to start a conversation about this product.</p>
          <Button onClick={() => window.location.href = '/auth'}>
            Log In
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[500px]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Product Chat
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          )}
        </div>
        {product && (
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <div className="flex-1">
              <div className="font-medium text-sm">{product.name}</div>
              <div className="text-sm text-muted-foreground">
                {formatUGX(product.price_ugx)}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/product/${product.slug}`, '_blank')}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender_id === user.id ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender_id !== user.id && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.sender_profile?.avatar_url} />
                  <AvatarFallback className="text-xs">
                    {message.message_type === 'bot' ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      getInitials(message.sender_profile?.first_name, message.sender_profile?.last_name)
                    )}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender_id === user.id
                    ? 'bg-primary text-primary-foreground'
                    : message.message_type === 'bot'
                    ? 'bg-secondary'
                    : 'bg-muted'
                }`}
              >
                <div className="text-sm">{message.content}</div>
                <div className="text-xs opacity-70 mt-1">
                  {format(new Date(message.created_at), 'HH:mm')}
                </div>
              </div>
              
              {message.sender_id === user.id && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">You</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t p-4 space-y-3">
          {/* Quick replies for bot responses */}
          {messages.length > 0 && messages[messages.length - 1]?.message_type === 'bot' && (
            <div className="flex flex-wrap gap-2">
              {['Product details', 'Shipping info', 'Payment options'].map((reply) => (
                <Badge
                  key={reply}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => sendQuickReply(reply)}
                >
                  {reply}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={sending}
            />
            <Button onClick={sendMessage} disabled={sending || !newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={openWhatsApp}>
              WhatsApp
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}