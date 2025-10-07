import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RealtimeProductSyncProps {
  onProductChange: () => void;
}

export function RealtimeProductSync({ onProductChange }: RealtimeProductSyncProps) {
  useEffect(() => {
    // Subscribe to product changes
    const productsChannel = supabase
      .channel('products-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('Product change detected:', payload);
          onProductChange();
          
          if (payload.eventType === 'INSERT') {
            toast.success('New product added!', {
              description: 'The product list has been updated.',
            });
          } else if (payload.eventType === 'UPDATE') {
            toast.info('Product updated', {
              description: 'Product information has been updated.',
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productsChannel);
    };
  }, [onProductChange]);

  return null;
}
