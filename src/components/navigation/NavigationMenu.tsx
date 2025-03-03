
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import NavigationItem from "./NavigationItem";
import NavigationActions from "./NavigationActions";
import NavigationLoginItems from "./NavigationLoginItems";
import { useState } from "react";
import { LucideIcon } from "lucide-react";

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
  hideAuth?: boolean;
}

const NavigationMenu = ({ isOpen, onToggle, navItems, searchQuery, setSearchQuery, isLoggedIn, hideAuth = false }: NavigationMenuProps) => {
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
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 animate-fadeIn fixed left-0 top-16 z-50 w-full h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-5 py-4 space-y-1 max-w-md mx-auto">
            {navItems.map((item) => (
              <NavigationItem
                key={item.title}
                item={item}
                onItemClick={() => onToggle()}
                mobile
              />
            ))}
            <div className="py-4 border-t border-gray-200 mt-4">
              <NavigationLoginItems 
                onItemClick={() => onToggle()} 
                className="flex items-center w-full px-4 py-3 text-base hover:bg-gray-100 rounded-md"
                mobile={true}
                isLoggedIn={isLoggedIn}
                hideAuth={hideAuth}
              />
            </div>
            <NavigationActions mobile onActionClick={() => onToggle()} hideAuth={hideAuth} />
          </div>
        </div>
      )}
    </>
  );
};

export default NavigationMenu;
