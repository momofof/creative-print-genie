
import { useState } from "react";
import NavigationLogo from "./navigation/NavigationLogo";
import NavigationSearch from "./navigation/NavigationSearch";
import NavigationItem from "./navigation/NavigationItem";
import NavigationActions from "./navigation/NavigationActions";
import NavigationMenu from "./navigation/NavigationMenu";
import { useUser } from "@supabase/auth-helpers-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const user = useUser();

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
            <NavigationLogo />
            <NavigationActions className="lg:hidden" />
          </div>

          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavigationItem key={item.title} item={item} />
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <NavigationSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              className="max-w-xs"
            />
            
            {user ? (
              <Link 
                to="/profile" 
                className="flex items-center ml-2 hover:opacity-80 transition-opacity"
                title="Votre profil"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="Photo de profil" />
                  <AvatarFallback className="text-sm bg-accent text-accent-foreground">
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : null}
          </div>

          <NavigationMenu
            isOpen={isMenuOpen}
            onToggle={() => setIsMenuOpen(!isMenuOpen)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            navItems={navItems}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
