-- Create notifications table for admin
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policy for admins to view their notifications
CREATE POLICY "Admins can view their notifications"
  ON public.notifications
  FOR SELECT
  USING (
    auth.uid() = admin_id OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Policy for system to create notifications
CREATE POLICY "System can create notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (true);

-- Policy for admins to update their notifications
CREATE POLICY "Admins can update their notifications"
  ON public.notifications
  FOR UPDATE
  USING (
    auth.uid() = admin_id OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Create function to notify admins of new orders
CREATE OR REPLACE FUNCTION public.notify_admins_new_order()
RETURNS TRIGGER AS $$
DECLARE
  admin_record RECORD;
BEGIN
  -- Loop through all admins and create notification for each
  FOR admin_record IN 
    SELECT id FROM profiles WHERE role = 'admin'
  LOOP
    INSERT INTO public.notifications (
      admin_id,
      type,
      message,
      metadata
    ) VALUES (
      admin_record.id,
      'new_order',
      'New order ' || NEW.order_number || ' received',
      jsonb_build_object(
        'order_id', NEW.id,
        'order_number', NEW.order_number,
        'total_amount', NEW.total_amount_ugx
      )
    );
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new orders
DROP TRIGGER IF EXISTS on_order_created ON public.orders;
CREATE TRIGGER on_order_created
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admins_new_order();