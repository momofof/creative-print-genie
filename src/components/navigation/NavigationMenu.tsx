
import { Menu, X } from "lucide-react";

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

const NavigationMenu = ({ isOpen, onToggle }: NavigationMenuProps) => {
  return (
    <button
      className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
      onClick={onToggle}
      aria-label="Menu"
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );
};

export default NavigationMenu;
