import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Eye, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { formatUGX } from '@/utils/formatUGX';
import type { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className = '' }: ProductCardProps) {
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to add items to your cart.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }
    
    if (!product.inStock) {
      toast({
        title: 'Out of Stock',
        description: 'This product is currently out of stock.',
        variant: 'destructive',
      });
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      inStock: product.inStock,
    });

    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to manage your wishlist.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({
        title: 'Removed from Wishlist',
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        inStock: product.inStock,
      });
      toast({
        title: 'Added to Wishlist',
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const handleChatClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to chat about products.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    navigate(`/messages?product=${product.id}`);
  };

  // Use centralized UGX formatter
  const formatPrice = formatUGX;

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card className={`product-card group ${className}`}>
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative">
          {/* Mobile-optimized image container */}
          <div className="aspect-square bg-muted overflow-hidden rounded-t-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
          </div>
          
          {/* Compact badges for mobile */}
          <div className="absolute top-1 left-1 flex flex-col gap-0.5">
            {discountPercentage > 0 && (
              <Badge className="bg-red-500 text-white text-[10px] px-1 py-0 rounded h-4 flex items-center">
                -{discountPercentage}%
              </Badge>
            )}
            {product.isNew && (
              <Badge className="bg-green-500 text-white text-[10px] px-1 py-0 rounded h-4 flex items-center">
                New
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4 flex items-center">
                Out
              </Badge>
            )}
          </div>

          {/* Quick Actions - Desktop only */}
          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex">
            <div className="flex flex-col gap-1">
              <Button
                variant="secondary"
                size="icon"
                className="h-6 w-6 rounded-full"
                onClick={handleToggleWishlist}
              >
                <Heart 
                  className={`h-3 w-3 ${isInWishlist(product.id) ? 'fill-current text-red-500' : ''}`} 
                />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-6 w-6 rounded-full"
                onClick={handleChatClick}
              >
                <MessageCircle className="h-3 w-3" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-6 w-6 rounded-full"
                asChild
              >
                <Link to={`/product/${product.id}`}>
                  <Eye className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile-optimized content */}
        <CardContent className="p-2">
          <div className="space-y-1">
            {/* Compact title for mobile */}
            <h3 className="font-medium text-xs leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            
            {/* Rating - Hidden on mobile, visible on desktop */}
            <div className="hidden sm:flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-2.5 w-2.5 ${
                      star <= Math.floor(product.rating)
                        ? 'fill-rating text-rating'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount})
              </span>
            </div>

            {/* Price - Kilimall style with red accent */}
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm text-red-600">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Link>

      {/* Compact footer for mobile */}
      <CardFooter className="p-2 pt-0">
        <Button 
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full h-7 text-xs bg-red-500 hover:bg-red-600"
          size="sm"
        >
          <ShoppingCart className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
          <span className="sm:hidden">{product.inStock ? 'Add' : 'Out'}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}