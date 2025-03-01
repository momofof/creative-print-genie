
import { Link } from "react-router-dom";
import { UserRound, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface NavigationLoginItemsProps {
  onItemClick?: () => void;
  className?: string;
  mobile?: boolean;
}

const NavigationLoginItems = ({ onItemClick, className = "", mobile = false }: NavigationLoginItemsProps) => {
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

      // Exécuter le callback de clic si fourni
      if (onItemClick) {
        onItemClick();
      }
    } catch (error) {
      // Capturer toute erreur inattendue, mais l'utilisateur est déjà "déconnecté" visuellement
      console.log("Info déconnexion:", error);
    }
  };

  if (mobile) {
    return (
      <div className={className}>
        {isLoggedIn ? (
          <>
            <Link
              to="/profile"
              className="flex items-center w-full"
              aria-label="User Profile"
              onClick={onItemClick}
            >
              <UserRound size={18} className="mr-2" />
              <span>Profil</span>
            </Link>
            <button 
              className="flex items-center w-full mt-2 text-red-500" 
              onClick={handleSignOut}
              aria-label="Log out"
            >
              <LogOut size={18} className="mr-2" />
              <span>Se déconnecter</span>
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="flex items-center w-full"
            aria-label="Login"
            onClick={onItemClick}
          >
            <UserRound size={18} className="mr-2" />
            <span>Connexion</span>
          </Link>
        )}
      </div>
    );
  }
  
  return (
    <div className={className}>
      {isLoggedIn ? (
        <div className="relative" ref={dropdownRef}>
          <Button 
            variant="ghost" 
            size="icon"
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-secondary/80"
            onClick={() => setShowDropdown(!showDropdown)}
            aria-label="User menu"
          >
            <UserRound size={20} className="text-gray-700" />
          </Button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <Link
                to="/profile"
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                onClick={() => {
                  setShowDropdown(false);
                  if (onItemClick) onItemClick();
                }}
              >
                <UserRound size={16} className="mr-2" />
                Profil
              </Link>
              <button 
                onClick={handleSignOut} 
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                <LogOut size={16} className="mr-2" />
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link
          to="/login"
          className="p-2 rounded-full hover:bg-secondary/80 transition-colors"
          aria-label="Login"
          onClick={onItemClick}
        >
          <UserRound className="text-gray-700" size={20} />
        </Link>
      )}
    </div>
  );
};

export default NavigationLoginItems;
