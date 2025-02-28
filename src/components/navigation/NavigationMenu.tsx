
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@supabase/auth-helpers-react";
import { ChevronDown, X } from "lucide-react";
import NavigationSearch from "./NavigationSearch";
import NavigationActions from "./NavigationActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavigationMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  navItems: {
    title: string;
    link: string;
    children?: { title: string; link: string }[];
  }[];
}

const NavigationMenu = ({ isOpen, onToggle, searchQuery, setSearchQuery, navItems }: NavigationMenuProps) => {
  const user = useUser();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleExpandedItem = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onToggle]);

  if (!isOpen) return null;

  return (
    <div
      className="absolute inset-x-0 top-16 bg-white shadow-lg rounded-b-lg z-50 lg:hidden py-4 px-4 max-h-[80vh] overflow-y-auto"
      ref={menuRef}
    >
      <div className="flex justify-end mb-2">
        <button
          onClick={onToggle}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Fermer le menu"
        >
          <X size={24} />
        </button>
      </div>

      <NavigationSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        className="mb-4"
      />

      {user ? (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <Link 
            to="/profile" 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            onClick={onToggle}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src="" alt="Photo de profil" />
              <AvatarFallback className="text-lg bg-accent text-accent-foreground">
                {user.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.email}</p>
              <p className="text-sm text-gray-500">Voir mon profil</p>
            </div>
          </Link>
        </div>
      ) : null}

      <div className="space-y-2">
        {navItems.map((item) => (
          <div key={item.title} className="border-b border-gray-100 pb-2">
            {item.children ? (
              <div>
                <button
                  className="flex w-full items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => toggleExpandedItem(item.title)}
                >
                  <span className="font-medium">{item.title}</span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${
                      expandedItems[item.title] ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedItems[item.title] && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.title}
                        to={child.link}
                        className="block p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={onToggle}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={item.link}
                className="block p-2 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                onClick={onToggle}
              >
                {item.title}
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <NavigationActions mobile={true} onActionClick={onToggle} />
      </div>
    </div>
  );
};

export default NavigationMenu;
