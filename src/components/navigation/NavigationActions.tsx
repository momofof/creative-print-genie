
import React from "react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface NavigationActionsProps {
  mobile?: boolean;
  onActionClick?: () => void;
  className?: string;
}

const NavigationActions = ({ mobile = false, onActionClick, className }: NavigationActionsProps) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      // Check if user is actually logged in before signing out
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        // If no session exists, just update UI and redirect
        navigate("/");
        return;
      }
      
      // If session exists, proceed with logout
      await supabase.auth.signOut();
      toast.success("Déconnexion réussie");
      navigate("/");
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
      // Redirect anyway
      navigate("/");
    }
  };

  // Créer une fonction pour vérifier si l'utilisateur est connecté
  const getUserStatus = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      return !!data.session;
    } catch (error) {
      console.error("Erreur lors de la vérification de la session:", error);
      return false;
    }
  };

  // Utiliser getUserStatus pour afficher le bouton approprié
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    getUserStatus().then(status => {
      setIsLoggedIn(status);
    });
    
    // Écouter les changements d'état d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (mobile) {
    return (
      <div className="pt-4 space-y-2">
        {isLoggedIn ? (
          <button
            onClick={() => {
              handleSignOut();
              onActionClick?.();
            }}
            className="block w-full text-center px-4 py-2 bg-accent text-accent-foreground rounded-full text-sm font-medium hover:bg-accent/90"
          >
            Se déconnecter
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="block w-full text-center px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={onActionClick}
            >
              Se connecter
            </Link>
            <Link
              to="/signup"
              className="block w-full text-center px-4 py-2 bg-accent text-accent-foreground rounded-full text-sm font-medium hover:bg-accent/90"
              onClick={onActionClick}
            >
              S'inscrire
            </Link>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={twMerge("hidden lg:flex items-center space-x-4", className)}>
      {isLoggedIn ? (
        <button
          onClick={handleSignOut}
          className="text-sm font-medium bg-accent text-accent-foreground px-4 py-2 rounded-full hover:bg-accent/90 transition-colors"
        >
          Se déconnecter
        </button>
      ) : (
        <>
          <Link
            to="/login"
            className="text-sm font-medium text-gray-700 hover:text-accent"
          >
            Se connecter
          </Link>
          <Link
            to="/signup"
            className="text-sm font-medium bg-accent text-accent-foreground px-4 py-2 rounded-full hover:bg-accent/90 transition-colors"
          >
            S'inscrire
          </Link>
        </>
      )}
    </div>
  );
};

export default NavigationActions;
