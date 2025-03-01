
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import NavigationItem from "./NavigationItem";
import NavigationActions from "./NavigationActions";
import NavigationLoginItems from "./NavigationLoginItems";
import { useState, useEffect } from "react";
import { LucideIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
}

const NavigationMenu = ({ isOpen, onToggle, navItems, searchQuery, setSearchQuery }: NavigationMenuProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
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

  return (
    <>
      <button
        className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
        onClick={onToggle}
        aria-label="Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {isOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 animate-fadeIn absolute left-0 top-full z-50 w-3/4 max-w-xs border-r border-gray-200">
          <div className="px-4 py-2 space-y-0.5">
            {navItems.map((item) => (
              <NavigationItem
                key={item.title}
                item={item}
                onItemClick={() => onToggle()}
                mobile
              />
            ))}
            <div className="py-2 border-t border-gray-100 mt-2">
              <NavigationLoginItems 
                isLoggedIn={isLoggedIn} 
                onItemClick={() => onToggle()} 
                className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                mobile={true}
              />
            </div>
            <NavigationActions mobile onActionClick={() => onToggle()} />
          </div>
        </div>
      )}
    </>
  );
};

export default NavigationMenu;
