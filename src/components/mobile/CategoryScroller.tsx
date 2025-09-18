import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Tv,
  Refrigerator,
  WashingMachine,
  Speaker,
  ChefHat,
  Shirt,
  Zap,
} from "lucide-react";
import { categories } from "@/data/products";

// Icon mapping for categories
const categoryIcons = {
  tvs: Tv,
  refrigerators: Refrigerator,
  "washing-machines": WashingMachine,
  "sound-systems": Speaker,
  cooking: ChefHat,
  irons: Shirt, // Using Shirt icon instead of Iron
  other: Zap,
};

export function CategoryScroller() {
  const navigate = useNavigate();

  // Promo banner data for sliding images
  const promoBanners = [
    {
      id: 1,
      title: "Flash Sale on TVs",
      discount: "40% OFF",
      image: "/assets/flash sale.jpg",
      link: "/shop?category=tvs",
      bgColor: "bg-red-500",
    },
    {
      id: 2,
      title: "New Refrigerator Deals",
      discount: "30% OFF",
      image: "/assets/refrigerators.jpg",
      link: "/shop?category=refrigerators",
      bgColor: "bg-blue-500",
    },
    {
      id: 3,
      title: "Washing Machines",
      discount: "25% OFF",
      image: "/assets/washing.jpg",
      link: "/shop?category=washing-machines",
      bgColor: "bg-green-500",
    },
    {
      id: 4,
      title: "Sound Systems",
      discount: "35% OFF",
      image: "/assets/sound.jpg",
      link: "/shop?category=sound-systems",
      bgColor: "bg-purple-500",
    },
    {
      id: 5,
      title: "Kitchen Appliances",
      discount: "20% OFF",
      image: "/assets/home.jpg",
      link: "/shop?category=cooking",
      bgColor: "bg-orange-500",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoBanners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [promoBanners.length]);

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/shop?category=${categoryId}`);
  };

  return (
    <div className="w-full bg-background border-b border-border">
      {/* Mobile Category Tabs */}
      <div className="md:hidden px-4 py-3">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => navigate("/shop")}
            className="flex-shrink-0 px-4 py-2 bg-red-500 text-white rounded-full text-sm font-medium">
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="flex-shrink-0 px-4 py-2 bg-muted text-muted-foreground rounded-full text-sm font-medium hover:bg-red-50 hover:text-red-600 transition-colors">
              {category.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Promo Sliding Banners */}
      <div className="md:hidden px-4 py-3 relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {promoBanners.map((banner) => (
            <Link
              key={banner.id}
              to={banner.link}
              className="flex-shrink-0 w-full">
              <div className="relative w-full h-24 bg-muted rounded-lg overflow-hidden">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                <div className="absolute left-2 bottom-1">
                  <p className="text-white text-xs font-medium">
                    {banner.title.split(" ")[0]}
                  </p>
                </div>
                <div
                  className={`absolute right-2 top-1 ${banner.bgColor} text-white text-xs px-2 py-0.5 rounded`}>
                  {banner.discount}
                </div>
              </div>
            </Link>
          ))}
        </div>
        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-2">
          {promoBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full ${
                index === currentSlide ? "bg-red-500" : "bg-muted-foreground"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Mobile Category Grid */}
      <div className="md:hidden grid grid-cols-5 gap-2 px-4 py-4">
        {categories.slice(0, 10).map((category) => {
          const IconComponent =
            categoryIcons[category.id as keyof typeof categoryIcons] || Zap;
          return (
            <Link
              key={category.id}
              to={`/shop?category=${category.id}`}
              className="flex flex-col items-center text-center group">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-2 group-hover:bg-red-50 transition-colors">
                <IconComponent className="h-6 w-6 text-foreground group-hover:text-red-500" />
              </div>
              <span className="text-xs text-muted-foreground font-medium line-clamp-2 leading-tight">
                {category.name.replace(" & ", "\n&\n")}
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
              const IconComponent =
                categoryIcons[category.id as keyof typeof categoryIcons] || Zap;
              return (
                <Link
                  key={category.id}
                  to={`/shop?category=${category.id}`}
                  className="flex items-center space-x-2 text-sm font-medium hover:text-primary transition-colors">
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
