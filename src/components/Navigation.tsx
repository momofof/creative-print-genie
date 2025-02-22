
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X, ChevronDown } from "lucide-react";

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
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-semibold">
              PrintGenie
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.title} className="relative group">
                <Link
                  to={item.link}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-accent flex items-center"
                >
                  {item.title}
                  {item.children && <ChevronDown className="ml-1 h-4 w-4" />}
                </Link>
                {item.children && (
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.title}
                          to={child.link}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:block max-w-xs">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-full bg-secondary/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-700 hover:text-accent"
            >
              Se connecter
            </Link>
            <Link
              to="/signup"
              className="text-sm font-medium bg-accent text-accent-foreground px-4 py-2 rounded-full hover:bg-accent/90 transition-colors"
            >
              S'inscrire
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 animate-fadeIn">
          <div className="px-4 py-3">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-full bg-secondary/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <div key={item.title}>
                <Link
                  to={item.link}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-accent hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.title}
                </Link>
                {item.children && (
                  <div className="pl-4 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.title}
                        to={child.link}
                        className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:text-accent hover:bg-gray-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 space-y-2">
              <Link
                to="/login"
                className="block w-full text-center px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Se connecter
              </Link>
              <Link
                to="/signup"
                className="block w-full text-center px-4 py-2 bg-accent text-accent-foreground rounded-full text-sm font-medium hover:bg-accent/90"
                onClick={() => setIsMenuOpen(false)}
              >
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
