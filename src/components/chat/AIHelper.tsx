import React, { useState } from 'react';
import { Bot, Send, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIHelper() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI assistant. I can help you with:\n\n• Product information and recommendations\n• Order tracking and status\n• Technical specifications\n• General shopping questions\n\nHow can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response (replace with actual AI integration)
    setTimeout(() => {
      const response = getAIResponse(inputMessage);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const getAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('track') || lowerQuery.includes('order')) {
      return "To track your order, please go to your Profile > Orders section. You can view the status of all your orders there. If you need more help, feel free to contact our support team.";
    }

    if (lowerQuery.includes('return') || lowerQuery.includes('refund')) {
      return "We offer a 30-day return policy on most items. To initiate a return, go to your Orders and click on the 'Return' button next to the product. Our team will guide you through the process.";
    }

    if (lowerQuery.includes('warranty') || lowerQuery.includes('guarantee')) {
      return "All our products come with manufacturer warranties. The warranty period varies by product - typically 1-2 years for electronics. Check the product page for specific warranty information.";
    }

    if (lowerQuery.includes('payment') || lowerQuery.includes('pay')) {
      return "We accept Mobile Money (MTN, Airtel), Credit/Debit Cards, and Cash on Delivery. All payments are secure and encrypted. You can select your preferred payment method at checkout.";
    }

    if (lowerQuery.includes('delivery') || lowerQuery.includes('shipping')) {
      return "We offer delivery within Kampala (1-2 business days) and upcountry (3-5 business days). Delivery is free for orders over UGX 50,000. You can track your delivery in real-time once your order is dispatched.";
    }

    if (lowerQuery.includes('recommend') || lowerQuery.includes('suggest')) {
      return "I'd be happy to help you find the perfect product! What type of electronics are you looking for? We have TVs, smartphones, laptops, home appliances, and more. Let me know your budget and requirements!";
    }

    return "I understand you're asking about: " + query + "\n\nFor detailed assistance, please contact our customer support team via WhatsApp or call us. They'll be happy to help you with specific questions about products, orders, or any other concerns.";
  };

  const handleWhatsAppContact = () => {
    const phoneNumber = '+256745187279';
    const message = encodeURIComponent('Hi, I need help with my order at Afuwah\'s Electronics');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">AI Assistant</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleWhatsAppContact}
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            WhatsApp Support
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce delay-75" />
                    <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce delay-150" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}