
import { useState } from "react";
import NavigationMenu from "./NavigationMenu";
import NavigationSearch from "./NavigationSearch";
import NavigationCart from "./NavigationCart";
import NavigationLoginItems from "./NavigationLoginItems";
import NavigationUserAvatar from "./NavigationUserAvatar";
import { productCategories } from "@/data/categories";
import { Briefcase } from "lucide-react";

interface NavigationMobileProps {
  isLoggedIn: boolean;
  isSupplier: boolean;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  hideAuth: boolean;
}

const NavigationMobile = ({
  isLoggedIn,
  isSupplier,
  showSearch,
  setShowSearch,
  searchQuery,
  setSearchQuery,
  hideAuth
}: NavigationMobileProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <div className="flex items-center justify-between w-full lg:hidden">
      <NavigationMenu
        isOpen={isMenuOpen}
        onToggle={() => setIsMenuOpen(!isMenuOpen)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        navItems={navItems}
        isLoggedIn={isLoggedIn}
        isSupplier={isSupplier}
        hideAuth={hideAuth}
      />
      
      <div className="flex items-center space-x-2.5">
        <NavigationSearch 
          onClick={() => setShowSearch(!showSearch)} 
          className="p-2.5"
        />
        <NavigationCart className="p-2.5" />
        {!isLoggedIn && !hideAuth && (
          <NavigationLoginItems 
            isLoggedIn={isLoggedIn} 
            hideAuth={hideAuth} 
            className="p-2.5"
          />
        )}
        {isLoggedIn && <NavigationUserAvatar isSupplier={isSupplier} />}
      </div>
    </div>
  );
};

export default NavigationMobile;
