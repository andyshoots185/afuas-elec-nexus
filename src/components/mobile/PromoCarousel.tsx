import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

// Mock promo data - replace with real data from API/CMS
const promoData = [
  {
    id: 1,
    title: "Flash Sale",
    discount: "40% OFF",
    image: "/assets/flush.jpg",
    link: "/shop?sale=flash",
    bgColor: "bg-red-500",
  },
  {
    id: 2,
    title: "New Arrivals",
    discount: "NEW",
    image: "/assets/new.jpg",
    link: "/shop?filter=new",
    bgColor: "bg-green-500",
  },
  {
    id: 3,
    title: "TVs Sale",
    discount: "50% OFF",
    image: "/assets/tv.jpg",
    link: "/shop?category=tvs",
    bgColor: "bg-blue-500",
  },
  {
    id: 4,
    title: "Appliances",
    discount: "25% OFF",
    image: "/assets/app.jpg",
    link: "/shop?category=refrigerators",
    bgColor: "bg-purple-500",
  },
  {
    id: 5,
    title: "Sound Systems",
    discount: "30% OFF",
    image: "/assets/sod.jpg",
    link: "/shop?category=sound-systems",
    bgColor: "bg-orange-500",
  },
  {
    id: 6,
    title: "Kitchen",
    discount: "20% OFF",
    image: "/assets/kit.jpg",
    link: "/shop?category=cooking",
    bgColor: "bg-teal-500",
  },
];

export function PromoCarousel() {
  return (
    <div className="w-full bg-background">
      {/* Mobile Promo Carousel */}
      <div className="md:hidden px-4 py-4">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {promoData.map((promo) => (
            <Link
              key={promo.id}
              to={promo.link}
              className="flex-shrink-0 w-28 relative group">
              <div className="aspect-[2/1] bg-muted rounded-lg overflow-hidden relative">
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-1 left-1 right-1">
                  <p className="text-white text-xs font-medium line-clamp-1">
                    {promo.title}
                  </p>
                </div>
                {promo.discount !== "NEW" && (
                  <Badge
                    className={`absolute top-1 right-1 text-white text-xs px-1 py-0.5 ${promo.bgColor}`}>
                    {promo.discount}
                  </Badge>
                )}
                {promo.discount === "NEW" && (
                  <Badge
                    className={`absolute top-1 right-1 text-white text-xs px-1 py-0.5 ${promo.bgColor}`}>
                    NEW
                  </Badge>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop Promo Grid */}
      <div className="hidden md:block">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
            {promoData.map((promo) => (
              <Link key={promo.id} to={promo.link} className="relative group">
                <div className="aspect-[2/1] bg-muted rounded-lg overflow-hidden relative">
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-sm font-medium line-clamp-1">
                      {promo.title}
                    </p>
                  </div>
                  {promo.discount !== "NEW" && (
                    <Badge
                      className={`absolute top-2 right-2 text-white text-sm ${promo.bgColor}`}>
                      {promo.discount}
                    </Badge>
                  )}
                  {promo.discount === "NEW" && (
                    <Badge
                      className={`absolute top-2 right-2 text-white text-sm ${promo.bgColor}`}>
                      NEW
                    </Badge>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
