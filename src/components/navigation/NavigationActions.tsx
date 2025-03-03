
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
  hideAuth?: boolean;
}

const NavigationActions = ({ mobile = false, onActionClick, className, hideAuth = false }: NavigationActionsProps) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    const checkUserSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    
    checkUserSession();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      // Mettre immédiatement à jour l'interface utilisateur
      setIsLoggedIn(false);
      
      // Fermer le menu mobile si nécessaire
      if (onActionClick) {
        onActionClick();
      }
      
      // Ensuite tenter de déconnecter la session dans Supabase
      const { error } = await supabase.auth.signOut();
      
      // Afficher un message de succès et rediriger
      toast.success("Déconnexion réussie");
      navigate("/");
      
      // Journaliser les erreurs si nécessaire, mais ne pas interrompre l'expérience utilisateur
      if (error) {
        console.log("Info déconnexion:", error.message);
      }
    } catch (error) {
      // Capturer toute erreur inattendue, mais l'utilisateur est déjà "déconnecté" visuellement
      console.log("Info déconnexion:", error);
    }
  };

  // If hideAuth is true and we're on Pro page, don't render auth UI
  if (hideAuth) {
    return null;
  }

  if (mobile) {
    return (
      <div className="pt-4 space-y-2">
        {isLoggedIn ? (
          <button
            onClick={handleSignOut}
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
