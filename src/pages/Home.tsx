import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { ArrowRight, Star, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/shared/ProductCard";
import { TopSearchBar } from "@/components/mobile/TopSearchBar";
import { CategoryScroller } from "@/components/mobile/CategoryScroller";
import { PromoCarousel } from "@/components/mobile/PromoCarousel";
import { formatUGX } from "@/utils/formatUGX";
import { products } from "../data/products";
import { categories, getProductsByCategory } from "@/data/products";
import heroBanner from "@/assets/hero-banner.jpg";

interface Product {
  id: string;
  name: string;
  description: string;
  price_ugx: number;
  category_id: string;
  brand_id: string;
  status: string;
  image_url?: string;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [flashLoading, setFlashLoading] = useState(true);

  useEffect(() => {
    // Fetch featured products from database
    const fetchFeaturedProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_images (image_url, sort_order)
          `)
          .eq('status', 'active')
          .eq('is_featured', true)
          .order('created_at', { ascending: false })
          .limit(8);

        if (error) throw error;
        
        // Transform data to match expected format
        const transformedProducts = data?.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price_ugx,
          image: product.product_images?.[0]?.image_url || '/placeholder.svg',
          rating: 4.5,
          reviewCount: 0,
          inStock: product.stock_quantity > 0,
          category: product.category_id,
          brand: product.brand_id,
        })) || [];

        setFeaturedProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch flash sale products
    const fetchFlashSaleProducts = async () => {
      try {
        const now = new Date().toISOString();
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_images (image_url, sort_order)
          `)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(8) as any;

        if (error) throw error;
        
        // Filter flash sale products client-side until types are regenerated
        const flashData = data?.filter((p: any) => 
          p.is_flash_sale === true &&
          p.flash_sale_start &&
          p.flash_sale_end &&
          new Date(p.flash_sale_start) <= new Date(now) &&
          new Date(p.flash_sale_end) >= new Date(now)
        );
        
        const transformedProducts = (flashData || data)?.map((product: any) => ({
          id: product.id,
          name: product.name,
          price: product.price_ugx,
          image: product.product_images?.[0]?.image_url || '/placeholder.svg',
          rating: 4.5,
          reviewCount: 0,
          inStock: product.stock_quantity > 0,
          category: product.category_id,
          brand: product.brand_id,
        })) || [];

        setFlashSaleProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching flash sale products:', error);
      } finally {
        setFlashLoading(false);
      }
    };

    fetchFeaturedProducts();
    fetchFlashSaleProducts();

    // Set up real-time subscription for both featured and flash sale
    const productsChannel = supabase
      .channel('products-homepage-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          fetchFeaturedProducts();
          fetchFlashSaleProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productsChannel);
    };
  }, []);

  const tvs = getProductsByCategory("tvs").slice(0, 4);
  const appliances = getProductsByCategory("refrigerators").slice(0, 4);
  
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
          <img src={heroBanner} alt="Quality Electronics at Afuwah's Electronics" className="w-full h-full object-cover opacity-20" />
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
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary hidden md:flex">
                
              </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sale Section - Mobile Priority */}
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

          {/* Mobile: 2-column grid, Desktop: 4-column */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {flashLoading ? (
              <div className="col-span-full flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : flashSaleProducts.length > 0 ? (
              flashSaleProducts.slice(0, 4).map(product => <ProductCard key={product.id} product={product} />)
            ) : featuredProducts.length > 0 ? (
              featuredProducts.slice(0, 4).map(product => <ProductCard key={product.id} product={product} />)
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No flash sale products yet
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories Section - Compact for mobile */}
      <section className="section-spacing bg-background md:hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold mb-2">Shop by Category</h2>
            <p className="text-sm text-muted-foreground">
              Find what you need quickly
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {categories.slice(0, 6).map(category => (
              <Link
                key={category.id}
                to={`/shop?category=${category.id}`}
                className="text-center p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-xs leading-tight">
                  {category.name.split(" ")[0]}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Categories - Mobile Horizontal Scroll */}
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

          {/* Mobile: Horizontal scroll, Desktop: Grid */}
          <div className="md:hidden">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-4">
              {[...tvs, ...appliances].slice(0, 6).map(product => (
                <div key={product.id} className="flex-shrink-0 w-40">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:grid lg:grid-cols-2 gap-12">
            {/* TVs & Entertainment */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="text-2xl font-bold">Trending TVs</h3>
              </div>
              <div className="space-y-6">
                {tvs.map(product => (
                  <div
                    key={product.id}
                    className="flex gap-4 p-4 border border-border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="w-24 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm mb-1 line-clamp-2">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= Math.floor(product.rating)
                                  ? "fill-rating text-rating"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({product.reviewCount})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="price-text text-base">
                            {formatUGX(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="original-price text-xs">
                              {formatUGX(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/product/${product.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Appliances */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="text-2xl font-bold">Top Appliances</h3>
              </div>
              <div className="space-y-6">
                {appliances.map(product => (
                  <div
                    key={product.id}
                    className="flex gap-4 p-4 border border-border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="w-24 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm mb-1 line-clamp-2">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= Math.floor(product.rating)
                                  ? "fill-rating text-rating"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({product.reviewCount})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="price-text text-base">
                            {formatUGX(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="original-price text-xs">
                              {formatUGX(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/product/${product.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
              <div className="col-span-full flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map(product => <ProductCard key={product.id} product={product} />)
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No products yet
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section - Hidden on Mobile */}
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
