
import { Menu, X, ShoppingCart } from "lucide-react";
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

const NavigationMenu = ({ isOpen, onToggle, navItems, searchQuery, setSearchQuery }: NavigationMenuProps) => {
  return (
    <>
      <button
        className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
        onClick={onToggle}
        aria-label="Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {isOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 animate-fadeIn absolute left-0 top-full z-50 w-3/4 max-w-xs border-r border-gray-200">
          <div className="px-4 py-2 space-y-0.5">
            {navItems.map((item) => (
              <NavigationItem
                key={item.title}
                item={item}
                onItemClick={() => onToggle()}
                mobile
              />
            ))}
            <div className="py-2 border-t border-gray-100 mt-2">
              <button
                className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                aria-label="Shopping Cart"
              >
                <ShoppingCart size={18} className="mr-2" />
                <span>Panier</span>
              </button>
            </div>
            <NavigationActions mobile onActionClick={() => onToggle()} />
          </div>
        </div>
      )}
    </>
  );
};

export default NavigationMenu;
