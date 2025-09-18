import { Link, useLocation } from "react-router-dom";
import { Home, Grid3X3, MessageCircle, ShoppingCart, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";

export function BottomNavMobile() {
  const location = useLocation();
  const { itemCount } = useCart();

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      path: "/",
      isActive: location.pathname === "/",
    },
    {
      id: "categories",
      label: "Categories",
      icon: Grid3X3,
      path: "/shop",
      isActive: location.pathname === "/shop",
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageCircle,
      path: "/Massages",
      isActive: location.pathname === "/Massages",
      badge: 0, // Placeholder for message count
    },
    {
      id: "cart",
      label: "Cart",
      icon: ShoppingCart,
      path: "/cart",
      isActive: location.pathname === "/cart",
      badge: itemCount,
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      path: "/User Account",
      isActive:
        location.pathname === "/User Account" ||
        location.pathname === "/wishlist",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center py-1 px-2 relative ${
                item.isActive
                  ? "text-red-500"
                  : "text-muted-foreground hover:text-foreground"
              }`}>
              <div className="relative">
                <IconComponent className="h-6 w-6" />
                {item.badge && item.badge > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500">
                    {item.badge > 99 ? "99+" : item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
