import { Mail, Phone, MapPin, Users, Award, Truck, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function About() {
  const teamMembers = [
    {
      name: 'Afua Sebikaaka',
      role: 'Founder & CEO',
      description: 'Passionate about bringing quality electronics to Kenyan families.',
    },
    {
      name: 'Customer Service Team',
      role: 'Support Specialists',
      description: 'Dedicated to providing exceptional customer experience.',
    },
    {
      name: 'Technical Team',
      role: 'Product Experts',
      description: 'Ensuring every product meets our quality standards.',
    },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'We put our customers at the heart of everything we do, ensuring satisfaction with every purchase.',
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'Every product is carefully selected and tested to meet our high standards of quality and reliability.',
    },
    {
      icon: Truck,
      title: 'Reliable Delivery',
      description: 'Fast, secure delivery across Kenya with real-time tracking for peace of mind.',
    },
    {
      icon: Users,
      title: 'Community Focus',
      description: 'Building lasting relationships with customers and supporting local communities.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto container-padding">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6 pt-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <span>About Us</span>
        </nav>

        {/* Hero Section */}
        <section className="text-center section-spacing">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              About Afua's Electronics
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Your trusted partner for quality electronics in Kenya. Since our founding, we've been 
              committed to bringing the latest technology and home appliances to families across the country 
              at prices they can afford.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="section-spacing">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Afua's Electronics was born from a simple vision: to make quality electronics accessible 
                  to every Kenyan family. Founded by Afua Sebikaaka, our journey began with a commitment 
                  to bridge the gap between cutting-edge technology and affordability.
                </p>
                <p>
                  What started as a small electronics store has grown into a trusted name in Kenya's 
                  electronics retail space. We've built our reputation on three core principles: 
                  quality products, competitive prices, and exceptional customer service.
                </p>
                <p>
                  Today, we serve thousands of satisfied customers across Kenya, offering everything 
                  from the latest TVs and sound systems to essential home appliances like refrigerators 
                  and washing machines. Every product in our catalog is carefully selected to ensure 
                  it meets our high standards for quality and value.
                </p>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">5000+</div>
                  <div className="text-sm text-muted-foreground">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">500+</div>
                  <div className="text-sm text-muted-foreground">Products Available</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground">Customer Support</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">47</div>
                  <div className="text-sm text-muted-foreground">Counties Served</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="section-spacing bg-muted/30 -mx-8 px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These core values guide everything we do and shape our commitment to our customers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-0 shadow-none bg-background">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Our Mission */}
        <section className="section-spacing">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8">Our Mission</h2>
            <div className="max-w-4xl mx-auto">
              <blockquote className="text-xl text-muted-foreground italic leading-relaxed mb-8">
                "To democratize access to quality electronics across Kenya by providing authentic products, 
                competitive pricing, exceptional customer service, and reliable delivery to every corner of our nation."
              </blockquote>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Quality First</h3>
                  <p className="text-sm text-muted-foreground">
                    Every product is sourced from authorized dealers and comes with full warranty protection.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Fair Pricing</h3>
                  <p className="text-sm text-muted-foreground">
                    We believe quality shouldn't break the bank. Our pricing is competitive and transparent.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Nationwide Reach</h3>
                  <p className="text-sm text-muted-foreground">
                    From Nairobi to Mombasa, Kisumu to Eldoret - we deliver quality electronics everywhere.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="section-spacing bg-muted/30 -mx-8 px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The passionate people behind Afua's Electronics, working together to serve you better.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-sm text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Information */}
        <section className="section-spacing">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have questions about our products or services? We're here to help.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Phone className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="text-muted-foreground">0742083075</p>
                <p className="text-sm text-muted-foreground">Mon - Sat: 8AM - 8PM</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="text-muted-foreground">munirsebikaaka@mail.com</p>
                <p className="text-sm text-muted-foreground">We reply within 24 hours</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Visit Us</h3>
                <p className="text-muted-foreground">Kenya Wide Delivery</p>
                <p className="text-sm text-muted-foreground">Free delivery over KSh 50,000</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center">
            <Button asChild size="lg">
              <Link to="/contact">Contact Us Today</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}