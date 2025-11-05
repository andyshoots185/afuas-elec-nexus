-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create brands table
CREATE TABLE IF NOT EXISTS public.brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table matching local product structure
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  original_price DECIMAL(12, 2),
  image TEXT NOT NULL,
  category TEXT NOT NULL REFERENCES public.categories(id),
  brand TEXT NOT NULL REFERENCES public.brands(id),
  description TEXT NOT NULL,
  specifications JSONB DEFAULT '{}',
  features JSONB DEFAULT '[]',
  in_stock BOOLEAN DEFAULT true,
  rating DECIMAL(2, 1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_new BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  discount INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Anyone can view categories"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view brands"
  ON public.brands FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  USING (true);

-- Insert categories
INSERT INTO public.categories (id, name, icon) VALUES
  ('tvs', 'TVs & Entertainment', 'Tv'),
  ('refrigerators', 'Refrigerators', 'Refrigerator'),
  ('washing-machines', 'Washing Machines', 'WashingMachine'),
  ('sound-systems', 'Sound Systems', 'Speaker'),
  ('cooking', 'Cooking Appliances', 'ChefHat'),
  ('irons', 'Irons & Garment Care', 'Iron'),
  ('other', 'Other Electronics', 'Zap')
ON CONFLICT (id) DO NOTHING;

-- Insert brands
INSERT INTO public.brands (id, name) VALUES
  ('samsung', 'Samsung'),
  ('lg', 'LG'),
  ('jbl', 'JBL'),
  ('philips', 'Philips'),
  ('generic', 'Generic')
ON CONFLICT (id) DO NOTHING;

-- Insert sample products (one per category)
INSERT INTO public.products (id, name, price, original_price, image, category, brand, description, specifications, features, in_stock, rating, review_count, is_featured, discount) VALUES
  ('supabase-tv-1', 'Samsung 55" 4K UHD Smart TV', 850000, 950000, 'https://qbtrcwiesupnhsdomeal.supabase.co/storage/v1/object/public/product-images/samsung-tv.jpg', 'tvs', 'samsung', 'Experience stunning 4K UHD picture quality with this Samsung Smart TV featuring Crystal Processor 4K and smart connectivity.', '{"Screen Size": "55 inches", "Resolution": "4K UHD (3840 x 2160)", "Smart TV": "Yes - Tizen OS", "HDR": "HDR10+", "Connectivity": "WiFi, Bluetooth, 3x HDMI, 2x USB"}', '["Crystal Processor 4K", "Smart TV with Apps", "Voice Control", "Game Mode"]', true, 4.5, 128, true, 21),
  ('supabase-fridge-1', 'Samsung Double Door Refrigerator 350L', 850000, 1000000, 'https://qbtrcwiesupnhsdomeal.supabase.co/storage/v1/object/public/product-images/samsung-fridge.jpg', 'refrigerators', 'samsung', 'Spacious double door refrigerator with digital inverter technology and frost-free cooling.', '{"Capacity": "350 Liters", "Type": "Double Door", "Energy Rating": "3 Star", "Cooling Technology": "Frost Free", "Warranty": "2 Years Comprehensive"}', '["Digital Inverter", "Frost Free", "LED Lighting", "Vegetable Box"]', true, 4.6, 156, true, 11),
  ('supabase-washer-1', 'LG 7kg Front Load Washing Machine', 850000, 950000, 'https://qbtrcwiesupnhsdomeal.supabase.co/storage/v1/object/public/product-images/lg-washer.jpg', 'washing-machines', 'lg', 'Energy efficient front load washing machine with steam wash and AI DD technology.', '{"Capacity": "7 kg", "Type": "Front Load", "Energy Rating": "5 Star", "Spin Speed": "1000 RPM", "Warranty": "2 Years Comprehensive"}', '["AI Direct Drive", "Steam Wash", "Smart Diagnosis", "14 Wash Programs"]', true, 4.7, 203, true, 11),
  ('supabase-speaker-1', 'JBL PartyBox 310 Bluetooth Speaker', 750000, 850000, 'https://qbtrcwiesupnhsdomeal.supabase.co/storage/v1/object/public/product-images/jbl-speaker.jpg', 'sound-systems', 'jbl', 'Powerful portable party speaker with LED lights and wireless microphone capability.', '{"Power Output": "240W RMS", "Battery Life": "18 hours", "Connectivity": "Bluetooth 5.1, USB, AUX", "Features": "LED Light Show, IPX4 Splash Proof", "Warranty": "1 Year"}', '["LED Light Show", "Wireless Mic Ready", "True Wireless Stereo", "Power Bank Function"]', true, 4.8, 91, false, 12),
  ('supabase-microwave-1', 'LG 28L Solo Microwave Oven', 350000, null, 'https://qbtrcwiesupnhsdomeal.supabase.co/storage/v1/object/public/product-images/lg-microwave.jpg', 'cooking', 'lg', 'Spacious solo microwave oven with auto cook menus and energy saving features.', '{"Capacity": "28 Liters", "Type": "Solo Microwave", "Power": "900 Watts", "Control": "Touch Panel", "Warranty": "1 Year Comprehensive"}', '["Auto Cook Menus", "Child Lock", "LED Display", "Energy Saver"]', true, 4.3, 54, false, 0),
  ('supabase-iron-1', 'Philips Steam Iron 2400W', 150000, 170000, 'https://qbtrcwiesupnhsdomeal.supabase.co/storage/v1/object/public/product-images/philips-iron.jpg', 'irons', 'philips', 'Powerful steam iron with ceramic soleplate for smooth gliding and wrinkle removal.', '{"Power": "2400 Watts", "Soleplate": "Ceramic", "Steam Output": "40g/min", "Water Tank": "300ml", "Warranty": "2 Years"}', '["Ceramic Soleplate", "Vertical Steam", "Anti-Calc", "Drip Stop"]', true, 4.4, 123, false, 15),
  ('supabase-fan-1', 'Remote Control Ceiling Fan 56"', 180000, null, 'https://qbtrcwiesupnhsdomeal.supabase.co/storage/v1/object/public/product-images/ceiling-fan.jpg', 'other', 'generic', 'Energy efficient ceiling fan with remote control and LED lighting.', '{"Size": "56 inches", "Speeds": "3 Speed Control", "Control": "Remote Control", "Lighting": "LED Light", "Warranty": "1 Year Motor"}', '["Remote Control", "LED Lighting", "Reverse Function", "Energy Efficient"]', true, 4.0, 45, false, 0)
ON CONFLICT (id) DO NOTHING;

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();