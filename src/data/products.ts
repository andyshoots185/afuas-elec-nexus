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
}

export const categories = [
  { id: "tvs", name: "TVs & Entertainment", icon: "Tv" },
  { id: "refrigerators", name: "Refrigerators", icon: "Refrigerator" },
  { id: "washing-machines", name: "Washing Machines", icon: "WashingMachine" },
  { id: "sound-systems", name: "Sound Systems", icon: "Speaker" },
  { id: "cooking", name: "Cooking Appliances", icon: "ChefHat" },
  { id: "irons", name: "Irons & Garment Care", icon: "Iron" },
  { id: "other", name: "Other Electronics", icon: "Zap" },
];

// Products are now fetched from Supabase
// Use the useProducts() hook from @/hooks/useProducts instead
// Example: const { products, loading } = useProducts();
