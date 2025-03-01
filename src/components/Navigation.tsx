
import { useState, useEffect } from "react";
import { ShoppingCart, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import NavigationLogo from "./navigation/NavigationLogo";
import NavigationSearch from "./navigation/NavigationSearch";
import NavigationItem from "./navigation/NavigationItem";
import NavigationActions from "./navigation/NavigationActions";
import NavigationMenu from "./navigation/NavigationMenu";
import { supabase } from "@/integrations/supabase/client";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
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

  const handleSearchIconClick = () => {
    setShowSearch(!showSearch);
  };

  const navItems = [
    {
      title: "Catalogue",
      link: "/products",
    },
    {
      title: "Tarifs",
      link: "/pricing",
    },
    {
      title: "Comment ça marche",
      link: "/how-it-works",
      children: [
        { title: "Guide de démarrage", link: "/getting-started" },
        { title: "FAQ", link: "/faq" },
      ],
    },
    {
      title: "Solutions",
      link: "/solutions",
      children: [
        { title: "Pour créateurs", link: "/creators" },
        { title: "Pour entreprises", link: "/business" },
      ],
    },
    {
      title: "Apprendre",
      link: "/learn",
      children: [
        { title: "Tutoriels", link: "/tutorials" },
        { title: "Blog", link: "/blog" },
      ],
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
      title: "Soutien",
      link: "/support",
      children: [
        { title: "Centre d'aide", link: "/help-center" },
        { title: "Contact", link: "/contact" },
      ],
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
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-full bg-secondary/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            autoFocus
          />
        </div>
      )}
    </nav>
  );
};

export default Navigation;
