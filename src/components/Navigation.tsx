
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

import NavigationLogo from "./navigation/NavigationLogo";
import NavigationDesktop from "./navigation/NavigationDesktop";
import NavigationMobile from "./navigation/NavigationMobile";
import NavigationSearchOverlay from "./navigation/NavigationSearchOverlay";
import NavigationActions from "./navigation/NavigationActions";

interface NavigationProps {
  hideAuth?: boolean;
}

const Navigation = ({ hideAuth = false }: NavigationProps) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isLoggedIn, isSupplier } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex items-center">
            <Link to="/" className="mr-6 lg:mr-8">
              <NavigationLogo />
            </Link>

            <NavigationDesktop 
              isLoggedIn={isLoggedIn}
              isSupplier={isSupplier}
              showSearch={showSearch}
              setShowSearch={setShowSearch}
              hideAuth={hideAuth}
            />
          </div>

          <NavigationMobile 
            isLoggedIn={isLoggedIn}
            isSupplier={isSupplier}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            hideAuth={hideAuth}
          />
        </div>
      </div>

      <NavigationSearchOverlay 
        isOpen={showSearch} 
        onClose={() => setShowSearch(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </header>
  );
};

export default Navigation;
