
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavigationLogo from "./navigation/NavigationLogo";
import NavigationSearch from "./navigation/NavigationSearch";
import NavigationItem from "./navigation/NavigationItem";
import NavigationActions from "./navigation/NavigationActions";
import NavigationMenu from "./navigation/NavigationMenu";
import NavigationLoginItems from "./navigation/NavigationLoginItems";
import NavigationCart from "./navigation/NavigationCart";
import NavigationSearchOverlay from "./navigation/NavigationSearchOverlay";
import { supabase } from "@/integrations/supabase/client";
import { productCategories } from "@/data/productData";
import { useSearch } from "@/hooks/useSearch";
import { Briefcase } from "lucide-react";
import { NavigationItemInfo } from "@/types/product";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const searchResults = useSearch(searchQuery);
  const navigate = useNavigate();

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

  const handleSearchIconClick = () => {
    setShowSearch(!showSearch);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchResultClick = (link: string) => {
    setShowSearch(false);
    setSearchQuery("");
    navigate(link);
  };

  // Create subcategories navigation items for the Catalogue section
  const catalogueSubItems = productCategories.map(category => ({
    title: category.title,
    link: `/products/${category.id}`
  }));

  const navItems: NavigationItemInfo[] = [
    {
      title: "Catalogue",
      link: "/products",
      children: catalogueSubItems
    },
    {
      title: "Services",
      link: "/services",
      children: [
        { title: "Design personnalisé", link: "/custom-design" },
        { title: "Support technique", link: "/support" },
      ],
    },
    {
      title: "Pro",
      link: "/pro",
      icon: Briefcase,
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-2 py-3 lg:flex-row lg:items-center lg:justify-between lg:h-16 lg:py-0">
          <div className="flex items-center justify-between">
            {/* Mobile view: Menu icon on the left of the title */}
            <div className="flex items-center lg:hidden">
              <NavigationMenu
                isOpen={isMenuOpen}
                onToggle={() => setIsMenuOpen(!isMenuOpen)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                navItems={navItems}
                isLoggedIn={isLoggedIn}
              />
            </div>
            
            <NavigationLogo />
            
            <div className="flex items-center gap-2">
              <div className="flex items-center lg:hidden">
                <NavigationLoginItems isLoggedIn={isLoggedIn} />
                <NavigationSearch onClick={handleSearchIconClick} />
                <NavigationCart />
              </div>
              <NavigationActions className="lg:hidden ml-2" />
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavigationItem key={item.title} item={item} />
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <NavigationSearch onClick={handleSearchIconClick} />
            <NavigationCart />
            <NavigationLoginItems isLoggedIn={isLoggedIn} />
          </div>
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
