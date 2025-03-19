
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import NavigationUserAvatar from "@/components/navigation/NavigationUserAvatar";
import { supabase } from "@/integrations/supabase/client";
import NavigationCart from "@/components/navigation/NavigationCart";
import { useIsMobile } from "@/hooks/use-mobile";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn } = useAuthStatus();
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed w-full bg-white z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-xl font-bold text-accent">PrintGenie</span>
            </Link>
          </div>

          {/* Desktop navigation links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Button variant="link" asChild>
              <Link to="/" className="text-gray-600 hover:text-accent">
                Accueil
              </Link>
            </Button>
          </nav>

          {/* Mobile icons - NEW */}
          <div className="flex items-center space-x-2 md:hidden">
            <NavigationCart className="p-2" />
            {isLoggedIn && <NavigationUserAvatar isSupplier={false} />}
          </div>

          {/* Desktop authentication */}
          <div className="hidden md:flex items-center space-x-4">
            <NavigationCart className="p-2.5" />
            {isLoggedIn ? (
              <NavigationUserAvatar isSupplier={false} />
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="gap-2">
                  <span>Connexion</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-accent hover:bg-gray-50"
              onClick={toggleMenu}
            >
              Accueil
            </Link>
            
            <Link
              to="/cart"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-accent hover:bg-gray-50"
              onClick={toggleMenu}
            >
              Panier
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-accent hover:bg-gray-50"
                  onClick={toggleMenu}
                >
                  Profil
                </Link>
                <button
                  onClick={async () => {
                    try {
                      await supabase.auth.signOut();
                      toggleMenu();
                    } catch (error) {
                      console.error("Error signing out:", error);
                    }
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-gray-50"
                >
                  Se déconnecter
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-accent hover:bg-gray-50"
                onClick={toggleMenu}
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;
