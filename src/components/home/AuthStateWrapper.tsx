
import { ReactNode, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AuthStateWrapperProps {
  children: ReactNode;
}

const AuthStateWrapper = ({ children }: AuthStateWrapperProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement
    const checkUserSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    
    checkUserSession();
    
    // Écouter les changements d'état d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
};

export default AuthStateWrapper;
