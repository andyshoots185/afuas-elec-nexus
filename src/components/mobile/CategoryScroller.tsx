import { Link, useNavigate } from 'react-router-dom';
import { 
  Tv, 
  Refrigerator, 
  WashingMachine, 
  Speaker, 
  ChefHat, 
  Shirt, 
  Zap 
} from 'lucide-react';
import { categories } from '@/data/products';

// Icon mapping for categories
const categoryIcons = {
  'tvs': Tv,
  'refrigerators': Refrigerator,
  'washing-machines': WashingMachine,
  'sound-systems': Speaker,
  'cooking': ChefHat,
  'irons': Shirt, // Using Shirt icon instead of Iron
  'other': Zap,
};

export function CategoryScroller() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/shop?category=${categoryId}`);
  };

  return (
    <div className="w-full bg-background border-b border-border">
      {/* Mobile Category Tabs */}
      <div className="md:hidden px-4 py-3">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => navigate('/shop')}
            className="flex-shrink-0 px-4 py-2 bg-red-500 text-white rounded-full text-sm font-medium"
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="flex-shrink-0 px-4 py-2 bg-muted text-muted-foreground rounded-full text-sm font-medium hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              {category.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Category Grid */}
      <div className="md:hidden grid grid-cols-5 gap-2 px-4 py-4">
        {categories.slice(0, 10).map((category) => {
          const IconComponent = categoryIcons[category.id as keyof typeof categoryIcons] || Zap;
          return (
            <Link
              key={category.id}
              to={`/shop?category=${category.id}`}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-2 group-hover:bg-red-50 transition-colors">
                <IconComponent className="h-6 w-6 text-foreground group-hover:text-red-500" />
              </div>
              <span className="text-xs text-muted-foreground font-medium line-clamp-2 leading-tight">
                {category.name.replace(' & ', '\n&\n')}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Desktop Categories */}
      <div className="hidden md:block">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-8 py-3">
            {categories.map((category) => {
              const IconComponent = categoryIcons[category.id as keyof typeof categoryIcons] || Zap;
              return (
                <Link
                  key={category.id}
                  to={`/shop?category=${category.id}`}
                  className="flex items-center space-x-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{category.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}