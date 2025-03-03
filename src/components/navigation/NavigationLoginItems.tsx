
import { Link } from "react-router-dom";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationLoginItemsProps {
  onItemClick?: () => void;
  className?: string;
  mobile?: boolean;
  isLoggedIn?: boolean;
  hideAuth?: boolean;
}

// Ce composant ne gère plus que l'affichage du bouton de connexion
// pour les utilisateurs non connectés
const NavigationLoginItems = ({ 
  onItemClick, 
  className = "", 
  mobile = false, 
  isLoggedIn = false, 
  hideAuth = false 
}: NavigationLoginItemsProps) => {
  
  // Si hideAuth est vrai ou si l'utilisateur est connecté, ne rien afficher
  if (hideAuth || isLoggedIn) {
    return null;
  }
  
  if (mobile) {
    return (
      <div className={className}>
        <Link
          to="/login"
          className="flex items-center w-full"
          aria-label="Login"
          onClick={onItemClick}
        >
          <UserRound size={18} className="mr-2" />
          <span>Connexion</span>
        </Link>
      </div>
    );
  }
  
  return (
    <div className={className}>
      <Link
        to="/login"
        className="p-2 rounded-full hover:bg-secondary/80 transition-colors"
        aria-label="Login"
        onClick={onItemClick}
      >
        <UserRound className="text-gray-700" size={20} />
      </Link>
    </div>
  );
};

export default NavigationLoginItems;
