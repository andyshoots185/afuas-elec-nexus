import { Link } from 'react-router-dom';
import { Search, Phone, Mail, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function Help() {
  const faqs = [
    {
      question: "What are your delivery charges?",
      answer: "We offer free delivery for orders over Ugx 500,000. For orders below this amount, delivery charges are Ugx 20,000 within major cities and may vary for remote areas."
    },
    {
      question: "Do you offer warranty on products?",
      answer: "Yes, all our products come with manufacturer warranty. Coverage periods vary by product category: TVs and appliances typically have 2 years, small electronics have 1 year, and some accessories have 6 months."
    },
    {
      question: "Can I return or exchange items?",
      answer: "We offer a 30-day return policy for unused items in original packaging. Electronics must be in working condition with all accessories included. Some restrictions apply for certain items."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept Cash, Airtel Money, and bank transfers. Credit/debit card payments are coming soon. All payments are secure and processed immediately."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is confirmed, you'll receive a tracking number via SMS and email. You can also check your order status in the 'My Account' section."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto container-padding py-6">
        <nav className="text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <span>Help Center</span>
        </nav>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions or get in touch with our support team.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Phone className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Call Support</h3>
              <p className="text-muted-foreground text-sm mb-4">0745187279</p>
              <Button asChild variant="outline" size="sm">
                <a href="tel:0742083075">Call Now</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-muted-foreground text-sm mb-4">nakaakawaafuwa@gmail.com</p>
              <Button asChild variant="outline" size="sm">
                <Link to="/contact">Send Email</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <MessageSquare className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Contact Form</h3>
              <p className="text-muted-foreground text-sm mb-4">Send us a message</p>
              <Button asChild variant="outline" size="sm">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
