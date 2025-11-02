
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { ArrowRight, Star, TrendingUp, Loader2, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/shared/ProductCard";
import { ProductCardSkeleton } from "@/components/shared/ProductCardSkeleton";
import { TopSearchBar } from "@/components/mobile/TopSearchBar";
import { CategoryScroller } from "@/components/mobile/CategoryScroller";
import { PromoCarousel } from "@/components/mobile/PromoCarousel";
import { formatUGX } from "@/utils/formatUGX";
import { products } from "../data/products";
import { categories, getProductsByCategory } from "@/data/products";
import heroBanner from "@/assets/hero-banner.jpg";

// Countdown Timer Component
function CountdownTimer({ endDate }: { endDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded">
        <span className="text-sm font-bold">{String(timeLeft.days).padStart(2, '0')}</span>
        <span className="text-xs">d</span>
      </div>
      <span className="text-red-600 font-bold">:</span>
      <div className="flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded">
        <span className="text-sm font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="text-xs">h</span>
      </div>
      <span className="text-red-600 font-bold">:</span>
      <div className="flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded">
        <span className="text-sm font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="text-xs">m</span>
      </div>
      <span className="text-red-600 font-bold">:</span>
      <div className="flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded">
        <span className="text-sm font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="text-xs">s</span>
      </div>
    </div>
  );
}

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
    // Use static frontend data for products
    const loadFeaturedProducts = () => {
      const featured = products.filter(p => p.isFeatured).slice(0, 8);
      setFeaturedProducts(featured);
      setLoading(false);
    };

    // Use static frontend data for flash sale products
    const loadFlashSaleProducts = () => {
      const flashSale = products.filter(p => p.discount && p.discount > 0).slice(0, 8);
      setFlashSaleProducts(flashSale);
      setFlashLoading(false);
    };

    loadFeaturedProducts();
    loadFlashSaleProducts();
  }, []);

  const tvs = getProductsByCategory("tvs").slice(0, 4);
  const appliances = getProductsByCategory("refrigerators").slice(0, 4);
  
  // Flash sale end date (7 days from now)
  const flashSaleEndDate = new Date();
  flashSaleEndDate.setDate(flashSaleEndDate.getDate() + 7);
  
  // Hot categories with products
  const hotCategories = [
    { id: "tvs", name: "TVs & Entertainment", products: getProductsByCategory("tvs").slice(0, 4) },
    { id: "refrigerators", name: "Refrigerators", products: getProductsByCategory("refrigerators").slice(0, 4) },
    { id: "washing-machines", name: "Washing Machines", products: getProductsByCategory("washing-machines").slice(0, 4) },
    { id: "sound-systems", name: "Sound Systems", products: getProductsByCategory("sound-systems").slice(0, 4) }
  ];
  
  // You may like products
  const youMayLikeProducts = products.slice(0, 8);
  
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
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h2 className="text-lg md:text-2xl font-bold text-red-600 flex items-center gap-2">
                <Flame className="h-5 w-5 md:h-6 md:w-6" />
                Flash Sale
              </h2>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs md:text-sm text-muted-foreground">Ends in:</span>
                <CountdownTimer endDate={flashSaleEndDate} />
              </div>
              <Button asChild variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                <Link to="/shop?sale=flash">
                  View All <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Mobile: 2-column grid, Desktop: 4-column */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {flashLoading ? (
              <>
                {[1, 2, 3, 4].map(i => <ProductCardSkeleton key={i} />)}
              </>
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

      {/* Hot Categories Section */}
      <section className="section-spacing bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center justify-center gap-2">
              <Flame className="h-6 w-6 text-red-500" />
              Hot Categories
            </h2>
            <p className="text-muted-foreground">
              Trending products across popular categories
            </p>
          </div>

          <div className="space-y-12">
            {hotCategories.map((category) => (
              <div key={category.id}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl md:text-2xl font-bold">{category.name}</h3>
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/shop?category=${category.id}`}>
                      View All <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
                
                {/* Mobile: Horizontal scroll, Desktop: Grid */}
                <div className="md:hidden">
                  <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-4">
                    {category.products.map(product => (
                      <div key={product.id} className="flex-shrink-0 w-40">
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="hidden md:grid md:grid-cols-4 gap-6">
                  {category.products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ))}
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
              <>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <ProductCardSkeleton key={i} />)}
              </>
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

      {/* You May Like Section */}
      <section className="section-spacing bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">You May Like</h2>
            <p className="text-muted-foreground">
              Recommended products just for you
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {youMayLikeProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link to="/shop">
                Explore More <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
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

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/256700000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        aria-label="Chat on WhatsApp"
      >
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span className="absolute right-full mr-3 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Chat with us on WhatsApp
        </span>
      </a>
    </div>
  );
}
