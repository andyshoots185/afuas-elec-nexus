import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: 'Message Sent!',
        description: 'Thank you for contacting us. We will get back to you within 24 hours.',
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        category: '',
        message: '',
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto container-padding">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6 pt-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <span>Contact Us</span>
        </nav>

        {/* Hero Section */}
        <section className="text-center section-spacing">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Have a question about our products or need assistance? Our friendly customer service 
              team is here to help. Reach out to us through any of the channels below.
            </p>
          </div>
        </section>

        {/* Contact Information Cards */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Phone className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Phone Support</h3>
                <p className="text-muted-foreground mb-2">0742083075</p>
                <div className="text-sm text-muted-foreground">
                  <div>Mon - Sat: 8AM - 8PM</div>
                  <div>Sunday: 10AM - 6PM</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-muted-foreground mb-2">munirsebikaaka@mail.com</p>
                <div className="text-sm text-muted-foreground">
                  <div>Response within 24 hours</div>
                  <div>General inquiries welcome</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Delivery Coverage</h3>
                <p className="text-muted-foreground mb-2">Kenya Wide</p>
                <div className="text-sm text-muted-foreground">
                  <div>All 47 counties served</div>
                  <div>Free delivery over KSh 50,000</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <MessageSquare className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-muted-foreground mb-2">Coming Soon</p>
                <div className="text-sm text-muted-foreground">
                  <div>Real-time assistance</div>
                  <div>Product recommendations</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Form and Map */}
        <section className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="0700000000"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Inquiry Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="product">Product Question</SelectItem>
                        <SelectItem value="order">Order Support</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="warranty">Warranty Claim</SelectItem>
                        <SelectItem value="complaint">Complaint</SelectItem>
                        <SelectItem value="partnership">Business Partnership</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Brief subject of your message"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Please provide details about your inquiry..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Map Placeholder and Additional Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-8 text-center">
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Kenya Wide Coverage</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    We deliver to all 47 counties across Kenya
                  </p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>🏙️ Major Cities: Same day delivery available</div>
                    <div>🏘️ Towns: 1-2 business days</div>
                    <div>🌾 Rural Areas: 2-5 business days</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Customer Service</div>
                    <div className="text-sm text-muted-foreground">Mon - Sat: 8:00 AM - 8:00 PM</div>
                    <div className="text-sm text-muted-foreground">Sunday: 10:00 AM - 6:00 PM</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Technical Support</div>
                    <div className="text-sm text-muted-foreground">24/7 Emergency Support</div>
                    <div className="text-sm text-muted-foreground">For warranty and technical issues</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/help">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Help Center & FAQ
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/account/orders">
                    <MapPin className="h-4 w-4 mr-2" />
                    Track Your Order
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/terms">
                    <Mail className="h-4 w-4 mr-2" />
                    Terms & Conditions
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-spacing bg-muted/30 -mx-8 px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Quick answers to common questions. Can't find what you're looking for? Contact us directly.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold mb-2">What are your delivery charges?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We offer free delivery for orders over KSh 50,000. For orders below this amount, 
                delivery charges are KSh 2,000 within major cities.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Do you offer warranty on products?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Yes, all our products come with manufacturer warranty. Coverage periods vary by 
                product category, typically ranging from 1-2 years.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Can I return or exchange items?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We offer a 30-day return policy for unused items in original packaging. 
                Some restrictions apply for certain electronic items.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We accept M-Pesa, Airtel Money, and bank transfers. Credit/debit card payments 
                are coming soon to provide more payment options.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Button asChild>
              <Link to="/help">View All FAQs</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}