
import { useState, useEffect } from "react";
import { ShoppingCart, UserRound, Briefcase } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import NavigationLogo from "./navigation/NavigationLogo";
import NavigationSearch from "./navigation/NavigationSearch";
import NavigationItem from "./navigation/NavigationItem";
import NavigationActions from "./navigation/NavigationActions";
import NavigationMenu from "./navigation/NavigationMenu";
import { supabase } from "@/integrations/supabase/client";
import { productCategories } from "@/data/productData";
import { useSearch } from "@/hooks/useSearch";

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

  const navItems = [
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
              />
            </div>
            
            <NavigationLogo />
            
            <div className="flex items-center gap-2">
              <div className="flex items-center lg:hidden">
                {isLoggedIn ? (
                  <Link
                    to="/profile"
                    className="p-2 rounded-full hover:bg-secondary/80 transition-colors"
                    aria-label="User Profile"
                  >
                    <UserRound className="text-gray-700" size={20} />
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="p-2 rounded-full hover:bg-secondary/80 transition-colors"
                    aria-label="Login"
                  >
                    <UserRound className="text-gray-700" size={20} />
                  </Link>
                )}
                <NavigationSearch onClick={handleSearchIconClick} />
                <Link
                  to="/cart"
                  className="p-2 rounded-full hover:bg-secondary/80 transition-colors"
                  aria-label="Shopping Cart"
                >
                  <ShoppingCart className="text-gray-700" size={20} />
                </Link>
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
            <Link
              to="/cart"
              className="p-2 rounded-full hover:bg-secondary/80 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="text-gray-700" size={20} />
            </Link>
            {isLoggedIn ? (
              <Link
                to="/profile"
                className="p-2 rounded-full hover:bg-secondary/80 transition-colors"
                aria-label="User Profile"
              >
                <UserRound className="text-gray-700" size={20} />
              </Link>
            ) : (
              <Link
                to="/login"
                className="p-2 rounded-full hover:bg-secondary/80 transition-colors"
                aria-label="Login"
              >
                <UserRound className="text-gray-700" size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Search overlay when search icon is clicked */}
      {showSearch && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-md p-4 animate-fadeIn">
          <div className="max-w-3xl mx-auto">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 rounded-full bg-secondary/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              autoFocus
            />
            
            {searchResults.length > 0 && searchQuery && (
              <div className="mt-4 bg-white rounded-lg shadow-lg border border-gray-100 max-h-96 overflow-y-auto">
                {searchResults.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleSearchResultClick(result.link)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-none"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{result.title}</p>
                        {result.parentCategory && (
                          <p className="text-sm text-gray-500">
                            dans {result.parentCategory}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 capitalize">
                        {result.type}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;

