
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import NavigationUserAvatar from "@/components/navigation/NavigationUserAvatar";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn } = useAuthStatus();
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed w-full bg-white z-50 shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold">SafePay <span className="text-blue-600">XOF</span></span>
            </Link>
          </div>

          {/* Desktop navigation links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Button variant="link" asChild>
              <Link to="/" className="text-gray-600 hover:text-blue-600">
                Accueil
              </Link>
            </Button>
            {isLoggedIn && (
              <Button variant="link" asChild>
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">
                  Tableau de bord
                </Link>
              </Button>
            )}
            <Button variant="link" asChild>
              <Link to="#comment-ca-marche" className="text-gray-600 hover:text-blue-600">
                Comment ça marche
              </Link>
            </Button>
          </nav>

          {/* Desktop authentication */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <NavigationUserAvatar isSupplier={false} />
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="gap-2 border-blue-600 text-blue-600 hover:bg-blue-50">
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              onClick={toggleMenu}
            >
              Accueil
            </Link>
            
            {isLoggedIn && (
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={toggleMenu}
              >
                Tableau de bord
              </Link>
            )}
            
            <Link
              to="#comment-ca-marche"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              onClick={toggleMenu}
            >
              Comment ça marche
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
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
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50"
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
