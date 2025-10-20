import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useRealtimeOrders() {
  const [newOrderCount, setNewOrderCount] = useState(0);

  useEffect(() => {
    // Subscribe to new orders
    const ordersChannel = supabase
      .channel('new-orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          setNewOrderCount(prev => prev + 1);
          toast.success('New Order Received!', {
            description: `Order ${payload.new.order_number} - ${payload.new.total_amount_ugx} UGX`,
            duration: 5000
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
    };
  }, []);

  const clearNewOrderCount = () => setNewOrderCount(0);

  return { newOrderCount, clearNewOrderCount };
}
