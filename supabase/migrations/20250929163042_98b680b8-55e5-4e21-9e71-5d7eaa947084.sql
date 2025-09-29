-- Fix remaining security issues

-- Create missing RLS policies for promotions table
CREATE POLICY "Public can read active promotions" ON public.promotions
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage promotions" ON public.promotions
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);