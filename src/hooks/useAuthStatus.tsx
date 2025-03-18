
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAuthStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };

    checkAuth();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsLoggedIn(!!session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { isLoggedIn };
};
