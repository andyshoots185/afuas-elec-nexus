import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
export function Footer() {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription');
  };
  return <footer className="bg-secondary-dark text-secondary-foreground mt-16">
      {/* Newsletter Section */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto container-padding">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated with Our Latest Offers</h3>
            <p className="mb-6 opacity-90">
              Get exclusive deals, new product announcements, and tech tips delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input type="email" placeholder="Enter your email address" className="flex-1 bg-white text-foreground" required />
              <Button type="submit" variant="secondary" className="px-8">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12 bg-yellow-50">
        <div className="container mx-auto container-padding">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="bg-primary text-primary-foreground px-3 py-2 rounded-lg font-bold text-xl">
                  Afua
                </div>
                <div>
                  <div className="font-semibold text-lg text-white bg-stone-500">Electronics</div>
                </div>
              </div>
              <p className="text-sm opacity-80">
                Your all-in-one destination for quality electronics. We provide the latest technology 
                at competitive prices with exceptional customer service.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="hover:bg-primary hover:text-primary-foreground">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-primary hover:text-primary-foreground">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-primary hover:text-primary-foreground">
                  <Twitter className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-500">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/shop" className="hover:text-primary transition-colors">Shop All Products</Link></li>
                <li><Link to="/shop?category=tvs" className="hover:text-primary transition-colors">TVs & Entertainment</Link></li>
                <li><Link to="/shop?category=refrigerators" className="hover:text-primary transition-colors">Refrigerators</Link></li>
                <li><Link to="/shop?category=washing-machines" className="hover:text-primary transition-colors">Washing Machines</Link></li>
                <li><Link to="/shop?category=sound-systems" className="hover:text-primary transition-colors">Sound Systems</Link></li>
                <li><Link to="/blog" className="hover:text-primary transition-colors">Tech Tips & Reviews</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-500">Customer Service</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link to="/account/orders" className="hover:text-primary transition-colors">Track Your Order</Link></li>
                <li><Link to="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                <li><Link to="/about" className="hover:text-primary transition-colors">About Afua's Electronics</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Get in Touch</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <Phone className="h-4 w-4 mt-0.5 text-primary" />
                  <div>
                    <div>0742083075</div>
                    <div className="text-xs opacity-70">Customer Support</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Mail className="h-4 w-4 mt-0.5 text-primary" />
                  <div>
                    <div>munirsebikaaka@mail.com</div>
                    <div className="text-xs opacity-70">General Inquiries</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                  <div>
                    <div>Kenya Wide Delivery</div>
                    <div className="text-xs opacity-70">Free delivery on orders over KSh 50,000</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-4 w-4 mt-0.5 text-primary" />
                  <div>
                    <div>Mon - Sat: 8AM - 8PM</div>
                    <div className="text-xs opacity-70">Customer Service Hours</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="opacity-20" />

      {/* Bottom Footer */}
      <div className="py-6 bg-slate-200">
        <div className="container mx-auto container-padding">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="mb-4 md:mb-0 opacity-80">
              © {new Date().getFullYear()} Afua's Electronics. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <span className="opacity-80">We Accept:</span>
              <div className="flex items-center space-x-3 text-xs">
                <div className="px-2 py-1 bg-muted rounded">MTN Money</div>
                <div className="px-2 py-1 bg-muted rounded">Airtel Money</div>
                <div className="px-2 py-1 bg-muted rounded">Cards</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>;
}