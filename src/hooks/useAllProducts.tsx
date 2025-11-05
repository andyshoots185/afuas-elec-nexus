import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { products as localProducts, Product } from "@/data/products";

/**
 * Custom hook to fetch and merge products from both local storage and Supabase
 * This allows for gradual migration - local products remain intact while Supabase products are added
 * 
 * How it works:
 * 1. Local products are loaded immediately (for fast initial render)
 * 2. Supabase products are fetched in the background
 * 3. Both are merged together and returned
 * 
 * Future products uploaded to Supabase will automatically appear after deployment!
 */
export function useAllProducts() {
  const [supabaseProducts, setSupabaseProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSupabaseProducts();
  }, []);

  const fetchSupabaseProducts = async () => {
    try {
      // Fetch products from Supabase
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("in_stock", true);

      if (error) {
        console.error("Error fetching Supabase products:", error);
        setLoading(false);
        return;
      }

      // Transform Supabase products to match local product structure
      const transformedProducts: Product[] = (data || []).map((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        originalPrice: p.original_price ? Number(p.original_price) : undefined,
        image: p.image, // Supabase image URL
        category: p.category,
        brand: p.brand,
        description: p.description,
        specifications: p.specifications as Record<string, string>,
        features: p.features as string[],
        inStock: p.in_stock,
        rating: Number(p.rating),
        reviewCount: p.review_count,
        isNew: p.is_new,
        isFeatured: p.is_featured,
        discount: p.discount,
      }));

      setSupabaseProducts(transformedProducts);
      setLoading(false);
    } catch (err) {
      console.error("Unexpected error:", err);
      setLoading(false);
    }
  };

  // Merge local and Supabase products
  // Local products come first to ensure presentation stability
  const allProducts = [...localProducts, ...supabaseProducts];

  return {
    products: allProducts,
    localProducts,
    supabaseProducts,
    loading,
  };
}
