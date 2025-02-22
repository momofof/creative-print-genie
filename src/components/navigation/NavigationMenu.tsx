
import { Menu, X } from "lucide-react";
import NavigationSearch from "./NavigationSearch";
import NavigationItem from "./NavigationItem";
import NavigationActions from "./NavigationActions";

interface NavigationMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  navItems: Array<{
    title: string;
    link: string;
    children?: Array<{ title: string; link: string }>;
  }>;
}

const NavigationMenu = ({ isOpen, onToggle, searchQuery, setSearchQuery, navItems }: NavigationMenuProps) => {
  return (
    <>
      <button
        className="lg:hidden p-2 rounded-md hover:bg-gray-100"
        onClick={onToggle}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 animate-fadeIn">
          <div className="px-4 py-3">
            <NavigationSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <NavigationItem
                key={item.title}
                item={item}
                onItemClick={onToggle}
                mobile
              />
            ))}
            <NavigationActions mobile onActionClick={onToggle} />
          </div>
        </div>
      )}
    </>
  );
};

export default NavigationMenu;
