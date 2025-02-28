
import { useState } from "react";
import NavigationLogo from "./navigation/NavigationLogo";
import NavigationSearch from "./navigation/NavigationSearch";
import NavigationItem from "./navigation/NavigationItem";
import NavigationActions from "./navigation/NavigationActions";
import NavigationMenu from "./navigation/NavigationMenu";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
            <div className="flex items-center gap-2">
              <NavigationSearch
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                className="lg:hidden w-36"
              />
              <div className="flex items-center">
                <NavigationMenu
                  isOpen={isMenuOpen}
                  onToggle={() => setIsMenuOpen(!isMenuOpen)}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  navItems={navItems}
                />
                <NavigationActions className="lg:hidden ml-2" />
              </div>
            </div>
          </div>

          {isMenuOpen && (
            <div className="lg:hidden bg-white border-t border-gray-200 animate-fadeIn">
              <div className="px-4 py-3 space-y-1">
                {navItems.map((item) => (
                  <NavigationItem
                    key={item.title}
                    item={item}
                    onItemClick={() => setIsMenuOpen(false)}
                    mobile
                  />
                ))}
                <NavigationActions mobile onActionClick={() => setIsMenuOpen(false)} />
              </div>
            </div>
          )}

          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavigationItem key={item.title} item={item} />
            ))}
          </div>

          <NavigationSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            className="hidden lg:block max-w-xs"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
