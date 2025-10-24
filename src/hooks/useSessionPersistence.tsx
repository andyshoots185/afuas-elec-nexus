import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to ensure Supabase session persists across page reloads
 */
export function useSessionPersistence() {
  useEffect(() => {
    // Ensure session is restored on mount
    const restoreSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          // Session exists and is automatically restored by Supabase
          console.log('Session restored successfully');
        }
      } catch (error) {
        console.error('Error restoring session:', error);
      }
    };

    restoreSession();

    // Listen for visibility changes to refresh session
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        supabase.auth.getSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
}
