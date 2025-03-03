
import { useState } from "react";
import { useLocation } from "react-router-dom";
import NavigationLogo from "./navigation/NavigationLogo";
import NavigationSearchOverlay from "./navigation/NavigationSearchOverlay";
import NavigationMobile from "./navigation/NavigationMobile";
import NavigationDesktop from "./navigation/NavigationDesktop";
import NavigationActions from "./navigation/NavigationActions";
import { useSearch } from "@/hooks/useSearch";
import { useNavigationAuth } from "@/hooks/useNavigationAuth";

const Navigation = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const searchResults = useSearch(searchQuery);
  const location = useLocation();
  const { isLoggedIn, isSupplier } = useNavigationAuth();
  
  // Check if we're on the Pro page or Pro Landing page
  const isProPage = location.pathname === "/pro" || location.pathname === "/pro-landing";

  const handleSearchResultClick = (link: string) => {
    setShowSearch(false);
    setSearchQuery("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-2 py-3 lg:flex-row lg:items-center lg:justify-between lg:h-16 lg:py-0">
          <div className="flex items-center justify-between w-full lg:w-auto">
            {/* Mobile view: Menu and logo */}
            <div className="lg:hidden flex items-center gap-2 w-1/4">
              <NavigationMobile 
                isLoggedIn={isLoggedIn}
                isSupplier={isSupplier}
                showSearch={showSearch}
                setShowSearch={setShowSearch}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                hideAuth={isProPage}
              />
            </div>
            
            <NavigationLogo />
            
            <div className="lg:hidden flex items-center gap-2">
              <NavigationActions className="ml-2" hideAuth={isProPage} />
            </div>
          </div>

          {/* Desktop navigation */}
          <NavigationDesktop 
            isLoggedIn={isLoggedIn}
            isSupplier={isSupplier}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            hideAuth={isProPage}
          />
        </div>
      </div>
      
      {/* Search overlay when search icon is clicked */}
      <NavigationSearchOverlay
        showSearch={showSearch}
        searchQuery={searchQuery}
        searchResults={searchResults}
        onSearchChange={handleSearchChange}
        onSearchResultClick={handleSearchResultClick}
      />
    </nav>
  );
};

export default Navigation;
