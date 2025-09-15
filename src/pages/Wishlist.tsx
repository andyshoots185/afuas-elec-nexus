import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/shared/ProductCard';
import { useWishlist } from '@/contexts/WishlistContext';

export default function Wishlist() {
  const { items, clearWishlist } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto container-padding py-16">
          <div className="max-w-md mx-auto text-center">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-4">Your wishlist is empty</h1>
            <p className="text-muted-foreground mb-8">
              Save items you love for later by adding them to your wishlist.
            </p>
            <Button asChild size="lg">
              <Link to="/shop">
                Start Shopping <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto container-padding py-6">
        <nav className="text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <span>Wishlist</span>
        </nav>
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
            <p className="text-muted-foreground">{items.length} saved items</p>
          </div>
          <Button variant="outline" onClick={clearWishlist}>
            Clear Wishlist
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <ProductCard 
              key={item.id} 
              product={{
                ...item,
                brand: 'Various',
                description: '',
                specifications: {},
                features: [],
                rating: 4.0,
                reviewCount: 0,
              }} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}