-- Enable real-time for orders table
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Enable real-time for reviews table  
ALTER TABLE public.reviews REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;

-- Create function to notify admins about new orders
CREATE OR REPLACE FUNCTION public.notify_admins_new_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Create trigger for new orders
DROP TRIGGER IF EXISTS on_new_order_notify_admins ON public.orders;
CREATE TRIGGER on_new_order_notify_admins
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admins_new_order();