
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useNavigationAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSupplier, setIsSupplier] = useState(false);

  useEffect(() => {
    const checkUserSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
      
      // Check if user is a supplier
      if (data.session) {
        const { data: supplierData } = await supabase
          .from('suppliers')
          .select('id')
          .eq('id', data.session.user.id)
          .single();
        
        setIsSupplier(!!supplierData);
      }
    };
    
    checkUserSession();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
      if (session) {
        // Check supplier status on auth change
        const checkSupplierStatus = async () => {
          const { data: supplierData } = await supabase
            .from('suppliers')
            .select('id')
            .eq('id', session.user.id)
            .single();
          
          setIsSupplier(!!supplierData);
        };
        checkSupplierStatus();
      } else {
        setIsSupplier(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { isLoggedIn, isSupplier };
};
