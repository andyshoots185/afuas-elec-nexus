-- Add category-level featured and flash sale flags
ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS featured_category boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS flash_sale_category boolean DEFAULT false;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_categories_featured ON public.categories(featured_category) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_categories_flash_sale ON public.categories(flash_sale_category) WHERE is_active = true;

-- Add flash sale columns to products if they don't exist
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS is_flash_sale boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS flash_sale_start timestamp with time zone,
ADD COLUMN IF NOT EXISTS flash_sale_end timestamp with time zone;

-- Create index for flash sale queries
CREATE INDEX IF NOT EXISTS idx_products_flash_sale ON public.products(is_flash_sale, flash_sale_start, flash_sale_end) WHERE status = 'active';

-- Verify storage bucket exists and is public
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'product-images') THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('product-images', 'product-images', true);
  ELSE
    UPDATE storage.buckets SET public = true WHERE id = 'product-images';
  END IF;
END $$;

-- Storage policies for product images
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
CREATE POLICY "Authenticated users can update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;
CREATE POLICY "Authenticated users can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');