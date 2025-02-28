
import { Link } from "react-router-dom";
import { UserRound } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const NavigationLogo = () => {
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

  return (
    <div className="flex items-center gap-3">
      {isLoggedIn && (
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
          <UserRound size={16} className="text-accent-foreground" />
        </div>
      )}
      <Link to="/" className="text-2xl font-semibold">
        PrintGenie
      </Link>
    </div>
  );
};

export default NavigationLogo;
