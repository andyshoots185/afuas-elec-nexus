import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * WhatsApp Support Button Component
 * 
 * Floating button that opens WhatsApp chat with support number
 * - Desktop: Shows icon + "Chat with us" text
 * - Mobile: Shows icon only for clean UI
 * - Positioned bottom-right with bounce animation on hover
 */
export default function WhatsAppButton() {
  const whatsappNumber = '256745187279';
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Chat with us on WhatsApp"
    >
      <Button
        size="lg"
        className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 bg-[#25D366] hover:bg-[#20BA5A] text-white gap-2"
      >
        <MessageCircle className="h-5 w-5" />
        {/* Show text only on desktop */}
        <span className="hidden md:inline">Chat with us</span>
      </Button>
    </a>
  );
}
