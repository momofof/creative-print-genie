
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
    const checkUserSession = async () => {
      const {
        data
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    checkUserSession();
    const {
      data: authListener
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });
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
      // Mettre immédiatement à jour l'interface utilisateur
      setIsLoggedIn(false);
      setShowDropdown(false);
      
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

  return <div className="flex items-center gap-1 sm:gap-3">
      {isLoggedIn && <div className="relative" ref={dropdownRef}>
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
            <UserRound size={16} className="text-accent-foreground" />
          </div>
          
          {showDropdown && <div className="absolute right-[-150px] xs:right-[-130px] sm:right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <button onClick={handleSignOut} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left">
                <LogOut size={16} className="mr-2" />
                Se déconnecter
              </button>
            </div>}
        </div>}
      <Link to="/" className="text-2xl font-semibold -ml-12 sm:ml-0">
        PrintGenie
      </Link>
    </div>;
};

export default NavigationLogo;
