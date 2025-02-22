
import { Search } from "lucide-react";

interface NavigationSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  className?: string;
}

const NavigationSearch = ({ searchQuery, setSearchQuery, className = "" }: NavigationSearchProps) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder="Rechercher..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 rounded-full bg-secondary/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
      />
      <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
    </div>
  );
};

export default NavigationSearch;
