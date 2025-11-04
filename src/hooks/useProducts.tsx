import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand: string;
  description: string;
  specifications: Record<string, string>;
  features: string[];
  inStock: boolean;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: number;
  slug: string;
}

interface RawProduct {
  id: string;
  name: string;
  price_ugx: number;
  compare_price_ugx?: number;
  image: string;
  category_id: string;
  brand_id: string;
  description: string;
  specifications: Record<string, string>;
  features: string[];
  in_stock: boolean;
  rating: number;
  review_count: number;
  is_featured: boolean;
  status: string;
  slug: string;
  categories: { name: string; slug: string } | null;
  brands: { name: string } | null;
  created_at: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();

    // Real-time subscription
    const channel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name, slug),
          brands(name)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedProducts: Product[] = (data || []).map((p: any) => {
        const discount = p.compare_price_ugx && p.price_ugx
          ? Math.round(((p.compare_price_ugx - p.price_ugx) / p.compare_price_ugx) * 100)
          : undefined;

        return {
          id: p.id,
          name: p.name,
          price: p.price_ugx,
          originalPrice: p.compare_price_ugx || undefined,
          image: p.image || '/placeholder.svg',
          category: p.categories?.slug || 'other',
          brand: p.brands?.name || 'Generic',
          description: p.description || '',
          specifications: p.specifications || {},
          features: p.features || [],
          inStock: p.in_stock,
          rating: p.rating || 0,
          reviewCount: p.review_count || 0,
          isFeatured: p.is_featured,
          isNew: isNewProduct(p.created_at),
          discount,
          slug: p.slug
        };
      });

      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, refetch: fetchProducts };
}

export function useProductById(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const { data, error} = await supabase
          .from('products')
          .select(`
            *,
            categories(name, slug),
            brands(name)
          `)
          .eq('id', id)
          .eq('status', 'active')
          .single();

        if (error) throw error;

        if (data) {
          const p = data as any;
          const discount = p.compare_price_ugx && p.price_ugx
            ? Math.round(((p.compare_price_ugx - p.price_ugx) / p.compare_price_ugx) * 100)
            : undefined;

          setProduct({
            id: p.id,
            name: p.name,
            price: p.price_ugx,
            originalPrice: p.compare_price_ugx || undefined,
            image: p.image || '/placeholder.svg',
            category: p.categories?.slug || 'other',
            brand: p.brands?.name || 'Generic',
            description: p.description || '',
            specifications: p.specifications || {},
            features: p.features || [],
            inStock: p.in_stock,
            rating: p.rating || 0,
            reviewCount: p.review_count || 0,
            isFeatured: p.is_featured,
            isNew: isNewProduct(p.created_at),
            discount,
            slug: p.slug
          });
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading };
}

export function useProductsByCategory(categorySlug: string) {
  const { products, loading } = useProducts();
  const categoryProducts = categorySlug === 'all' 
    ? products 
    : products.filter(p => p.category === categorySlug);
  
  return { products: categoryProducts, loading };
}

function isNewProduct(createdAt: string): boolean {
  const created = new Date(createdAt);
  const now = new Date();
  const daysDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
  return daysDiff <= 30; // Products newer than 30 days are "new"
}
