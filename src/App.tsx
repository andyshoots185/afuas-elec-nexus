import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNavMobile } from "@/components/mobile/BottomNavMobile";

// import AllCategories from "./pages/AllCategories";
// import CategoryPage from "./pages/CategoryPage";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Wishlist from "./pages/Wishlist";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import Messages from "./pages/Messages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1 pb-16 md:pb-0">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/messages" element={<Messages />} />
                  {/* <Route path="/categories" element={<AllCategories />} />
                  <Route path="/shop/:category" element={<CategoryPage />} /> */}
                  {/* <Route path="/shop/:category" element={<CategoryPage />} /> */}

                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <BottomNavMobile />
            </div>
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </TooltipProvider>
</QueryClientProvider>
);

export default App;
