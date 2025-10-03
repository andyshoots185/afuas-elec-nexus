-- Fix search_path for notify_admins_new_order function
CREATE OR REPLACE FUNCTION public.notify_admins_new_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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