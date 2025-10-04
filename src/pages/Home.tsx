import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/shared/ProductCard";
import { TopSearchBar } from "@/components/mobile/TopSearchBar";
import { CategoryScroller } from "@/components/mobile/CategoryScroller";
import { PromoCarousel } from "@/components/mobile/PromoCarousel";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import heroBanner from "@/assets/hero-banner.jpg";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
    
    // Subscribe to real-time updates for instant product display
    const subscription = supabase
      .channel('products-homepage')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'products'
      }, () => {
        fetchFeaturedProducts();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images (
            image_url,
            sort_order
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) throw error;

      // Transform data to match ProductCard expectations
      const transformedProducts = data?.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price_ugx,
        image: product.product_images?.[0]?.image_url || '/placeholder.svg',
        rating: 4.5,
        reviews: 0
      })) || [];

      setFeaturedProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Mobile Top Search Bar */}
      <TopSearchBar />

      {/* Category Scroller */}
      <CategoryScroller />

      {/* Promo Carousel */}
      <div className="hidden md:block">
        <PromoCarousel />
      </div>

      {/* Hero Section - Desktop only */}
      <section className="relative hero-section overflow-hidden hidden md:block">
        <div className="absolute inset-0">
          <img 
            src={heroBanner} 
            alt="Quality Electronics at Afuwah's Electronics" 
            className="w-full h-full object-cover opacity-20" 
          />
        </div>
        <div className="relative container mx-auto container-padding section-spacing bg-gray-200">
          <div className="max-w-2xl">
            <div className="space-y-6">
              <Badge className="bg-accent text-accent-foreground">
                🔥 New Year Sale - Up to 40% Off
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-slate-900">
                Your All-in-One Destination for
                <span className="text-accent"> Quality Electronics</span>
              </h1>
              <p className="text-lg opacity-90 leading-relaxed text-gray-950">
                Discover the latest TVs, refrigerators, washing machines, sound
                systems, and more at unbeatable prices. Quality you can trust,
                service you can count on.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="btn-cta">
                  <Link to="/shop">
                    Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary hidden md:flex">
                  <Link to="/shop">Browse Categories</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sale Section */}
      <section className="section-spacing bg-red-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h2 className="text-lg md:text-2xl font-bold text-red-600">
                Flash Sale
              </h2>
            </div>
            <Button asChild variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
              <Link to="/shop?sale=flash">
                View All <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {loading ? (
              <p className="col-span-full text-center">Loading...</p>
            ) : featuredProducts.length > 0 ? (
              featuredProducts.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground">No products available</p>
            )}
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="section-spacing bg-background md:hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold mb-2">Shop by Category</h2>
            <p className="text-sm text-muted-foreground">
              Find what you need quickly
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Link to="/shop?category=laptops" className="text-center p-3 rounded-lg hover:bg-muted transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2 mx-auto">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-xs leading-tight">Laptops</h3>
            </Link>
            <Link to="/shop?category=phones" className="text-center p-3 rounded-lg hover:bg-muted transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2 mx-auto">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-xs leading-tight">Phones</h3>
            </Link>
            <Link to="/shop?category=tvs" className="text-center p-3 rounded-lg hover:bg-muted transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2 mx-auto">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-xs leading-tight">TVs</h3>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="section-spacing">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg md:text-2xl font-bold">Trending Products</h3>
            <Button asChild variant="outline" size="sm">
              <Link to="/shop">
                View All <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {loading ? (
              <p className="col-span-full text-center">Loading...</p>
            ) : featuredProducts.length > 0 ? (
              featuredProducts.slice(4, 8).map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground">No products available</p>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-spacing bg-muted/30">
        <div className="container mx-auto container-padding">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">
                Handpicked electronics at amazing prices
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/shop">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <p className="col-span-full text-center">Loading...</p>
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground">No products available</p>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero-section section-spacing hidden md:block">
        <div className="container mx-auto container-padding text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Upgrade Your Electronics?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Join thousands of satisfied customers who trust Afuwah's Electronics
              for quality products and exceptional service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="btn-cta">
                <Link to="/shop">
                  Start Shopping <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-blue text-white hover:bg-white hover:text-primary">
                <Link to="/contact">Get Expert Advice</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
