
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import NavigationItem from "./NavigationItem";
import NavigationActions from "./NavigationActions";
import NavigationLoginItems from "./NavigationLoginItems";
import { LucideIcon } from "lucide-react";
import { UserRound, LogOut, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NavigationMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  navItems: Array<{
    title: string;
    link: string;
    icon?: LucideIcon;
    children?: Array<{ title: string; link: string }>;
  }>;
  isLoggedIn?: boolean;
  isSupplier?: boolean;
  hideAuth?: boolean;
}

const NavigationMenu = ({ 
  isOpen, 
  onToggle, 
  navItems, 
  searchQuery, 
  setSearchQuery, 
  isLoggedIn, 
  isSupplier = false,
  hideAuth = false 
}: NavigationMenuProps) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error signing out:", error);
        toast.error("Erreur lors de la déconnexion");
      } else {
        toast.success("Déconnexion réussie");
        navigate("/");
        onToggle(); // Fermer le menu
      }
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return (
    <>
      <button
        className="p-2.5 rounded-md hover:bg-gray-100 active:bg-gray-200 lg:hidden"
        onClick={onToggle}
        aria-label="Menu"
      >
        {isOpen ? <X size={26} className="text-gray-800" /> : <Menu size={26} className="text-gray-800" />}
      </button>
      
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col bg-white animate-fadeIn pt-20">
          <div className="flex-1 overflow-y-auto pb-safe">
            <div className="px-5 py-3 space-y-2 max-w-md mx-auto">
              {navItems.map((item) => (
                <NavigationItem
                  key={item.title}
                  item={item}
                  onItemClick={() => onToggle()}
                  mobile
                />
              ))}
              
              {isLoggedIn && !hideAuth ? (
                <div className="py-4 border-t border-gray-200 mt-5 space-y-1">
                  <Link
                    to="/profile"
                    className="flex items-center w-full px-5 py-3.5 text-base font-medium hover:bg-gray-100 active:bg-gray-200 rounded-md transition-colors"
                    onClick={() => onToggle()}
                  >
                    <UserRound size={20} className="mr-3.5 text-gray-700" />
                    <span>Profil</span>
                  </Link>
                  
                  {isSupplier && (
                    <Link
                      to="/pro"
                      className="flex items-center w-full px-5 py-3.5 text-base font-medium hover:bg-gray-100 active:bg-gray-200 rounded-md transition-colors"
                      onClick={() => onToggle()}
                    >
                      <Briefcase size={20} className="mr-3.5 text-gray-700" />
                      <span>Tableau de bord</span>
                    </Link>
                  )}
                  
                  <button 
                    className="flex items-center w-full px-5 py-3.5 text-base font-medium hover:bg-gray-100/90 active:bg-gray-200 rounded-md transition-colors text-red-500"
                    onClick={handleSignOut}
                  >
                    <LogOut size={20} className="mr-3.5" />
                    <span>Se déconnecter</span>
                  </button>
                </div>
              ) : !hideAuth ? (
                <div className="py-5 border-t border-gray-200 mt-5">
                  <NavigationLoginItems 
                    onItemClick={() => onToggle()} 
                    className="px-5"
                    mobile={true}
                    isLoggedIn={isLoggedIn}
                    hideAuth={hideAuth}
                  />
                </div>
              ) : null}
              
              {!isLoggedIn && !hideAuth && (
                <div className="mt-5 px-4">
                  <NavigationActions mobile onActionClick={() => onToggle()} hideAuth={hideAuth} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavigationMenu;
