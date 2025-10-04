-- Seed categories
INSERT INTO public.categories (name, slug, is_active, description)
VALUES 
  ('Laptops', 'laptops', true, 'High-performance laptops for work and gaming'),
  ('Phones', 'phones', true, 'Latest smartphones and mobile devices'),
  ('Accessories', 'accessories', true, 'Essential tech accessories and gadgets'),
  ('TVs', 'tvs', true, 'Smart TVs and entertainment systems')
ON CONFLICT (slug) DO NOTHING;

-- Seed brands
INSERT INTO public.brands (name, slug, is_active, description)
VALUES 
  ('Samsung', 'samsung', true, 'Leading electronics manufacturer'),
  ('Apple', 'apple', true, 'Premium technology products'),
  ('HP', 'hp', true, 'Trusted computing solutions'),
  ('Dell', 'dell', true, 'Enterprise and personal computing'),
  ('Sony', 'sony', true, 'Innovation in electronics and entertainment')
ON CONFLICT (slug) DO NOTHING;

-- Enable real-time for products table (if not already enabled)
ALTER TABLE public.products REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;