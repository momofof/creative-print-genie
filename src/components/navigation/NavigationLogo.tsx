
import { Link } from "react-router-dom";
import { UserRound, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const NavigationLogo = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

    // Ajouter un event listener pour fermer le dropdown quand on clique ailleurs
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      authListener.subscription.unsubscribe();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      // Vérifier d'abord si une session existe
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        // Si pas de session, mettre à jour l'état local sans appeler signOut
        setIsLoggedIn(false);
        setShowDropdown(false);
        toast.success("Vous êtes déjà déconnecté");
        navigate("/");
        return;
      }
      
      // Si la session existe, procéder à la déconnexion
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Déconnexion réussie");
      setShowDropdown(false);
      navigate("/");
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
      
      // En cas d'erreur, essayer de mettre à jour l'état manuellement
      setIsLoggedIn(false);
      setShowDropdown(false);
      toast.error("Erreur lors de la déconnexion, veuillez rafraîchir la page");
    }
  };

  return (
    <div className="flex items-center gap-3">
      {isLoggedIn && (
        <div className="relative" ref={dropdownRef}>
          <div 
            className="w-8 h-8 rounded-full bg-accent flex items-center justify-center cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <UserRound size={16} className="text-accent-foreground" />
          </div>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <button 
                onClick={handleSignOut}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut size={16} className="mr-2" />
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      )}
      <Link to="/" className="text-2xl font-semibold">
        PrintGenie
      </Link>
    </div>
  );
};

export default NavigationLogo;
