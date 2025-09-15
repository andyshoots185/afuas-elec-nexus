import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Truck, Headphones, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/shared/ProductCard';
import { featuredProducts, categories, getProductsByCategory } from '@/data/products';
import heroBanner from '@/assets/hero-banner.jpg';
export default function Home() {
  const tvs = getProductsByCategory('tvs').slice(0, 2);
  const appliances = getProductsByCategory('refrigerators').slice(0, 2);
  return <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative hero-section overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBanner} alt="Quality Electronics at Afua's Electronics" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="relative container mx-auto container-padding section-spacing">
          <div className="max-w-2xl">
            <div className="space-y-6">
              <Badge className="bg-accent text-accent-foreground">
                🔥 New Year Sale - Up to 40% Off
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Your All-in-One Destination for 
                <span className="text-accent"> Quality Electronics</span>
              </h1>
              <p className="text-lg opacity-90 leading-relaxed text-gray-950">
                Discover the latest TVs, refrigerators, washing machines, sound systems, 
                and more at unbeatable prices. Quality you can trust, service you can count on.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="btn-cta">
                  <Link to="/shop">
                    Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                  <Link to="/categories">
                    Browse Categories
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-spacing bg-muted/50">
        <div className="container mx-auto container-padding">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center border-0 shadow-none bg-transparent">
              <CardContent className="pt-6">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Free Delivery</h3>
                <p className="text-sm text-muted-foreground">Free delivery on orders over UGX 200,000</p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-none bg-transparent">
              <CardContent className="pt-6">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Warranty Protection</h3>
                <p className="text-sm text-muted-foreground">Comprehensive warranty on all products</p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-none bg-transparent">
              <CardContent className="pt-6">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Headphones className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">Round-the-clock customer support</p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-none bg-transparent">
              <CardContent className="pt-6">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Latest Technology</h3>
                <p className="text-sm text-muted-foreground">Cutting-edge electronics and appliances</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="section-spacing">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our wide range of electronics and appliances, carefully selected for quality and value.
            </p>
          </div>
          
          {/* Mobile Category Tabs - Horizontal scroll like Kilimall */}
          <div className="block md:hidden mb-6">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {['ALL', 'TVs', 'Appliances', 'Kitchen', 'Home', 'Phones'].map((cat) => (
                <Link 
                  key={cat}
                  to={cat === 'ALL' ? '/shop' : `/shop?category=${cat.toLowerCase()}`}
                  className="flex-shrink-0 px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Category Grid - Compact mobile layout like Kilimall */}
          <div className="grid grid-cols-5 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {categories.slice(0, 10).map(category => (
              <Link key={category.id} to={`/shop?category=${category.id}`} className="category-card group">
                <div className="text-center">
                  <div className="mx-auto w-10 h-10 md:w-16 md:h-16 bg-primary/10 rounded-lg md:rounded-full flex items-center justify-center mb-2 md:mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Zap className="h-4 w-4 md:h-8 md:w-8" />
                  </div>
                  <h3 className="font-medium text-xs md:text-sm leading-tight">{category.name}</h3>
                </div>
              </Link>
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
              <p className="text-muted-foreground">Handpicked electronics at amazing prices</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/shop">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          {/* Flash Sale Section - Mobile optimized like Kilimall */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-red-600">Flash Sale</h3>
              <div className="text-sm text-muted-foreground">Ends in 00:15:45</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
            {featuredProducts.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      {/* Trending Categories */}
      <section className="section-spacing">
        <div className="container mx-auto container-padding">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* TVs & Entertainment */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="text-2xl font-bold">Trending TVs</h3>
              </div>
              <div className="space-y-6">
                {tvs.map(product => <div key={product.id} className="flex gap-4 p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-24 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h4>
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => <Star key={star} className={`h-3 w-3 ${star <= Math.floor(product.rating) ? 'fill-rating text-rating' : 'text-muted-foreground'}`} />)}
                        </div>
                        <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <span className="price-text text-base">UGX {product.price.toLocaleString()}</span>
                           {product.originalPrice && <span className="original-price text-xs">UGX {product.originalPrice.toLocaleString()}</span>}
                        </div>
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/product/${product.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>

            {/* Appliances */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="text-2xl font-bold">Top Appliances</h3>
              </div>
              <div className="space-y-6">
                {appliances.map(product => <div key={product.id} className="flex gap-4 p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-24 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h4>
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => <Star key={star} className={`h-3 w-3 ${star <= Math.floor(product.rating) ? 'fill-rating text-rating' : 'text-muted-foreground'}`} />)}
                        </div>
                        <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <span className="price-text text-base">UGX {product.price.toLocaleString()}</span>
                           {product.originalPrice && <span className="original-price text-xs">UGX {product.originalPrice.toLocaleString()}</span>}
                        </div>
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/product/${product.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero-section section-spacing">
        <div className="container mx-auto container-padding text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Upgrade Your Electronics?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Join thousands of satisfied customers who trust Afua's Electronics for quality products and exceptional service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="btn-cta">
                <Link to="/shop">
                  Start Shopping <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                <Link to="/contact">
                  Get Expert Advice
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>;
}