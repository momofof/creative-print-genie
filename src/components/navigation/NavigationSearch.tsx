
import { useState } from "react";
import { Search } from "lucide-react";
import SearchResults from "./SearchResults";
import { useSearch } from "@/hooks/useSearch";
import { cn } from "@/lib/utils";

interface NavigationSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  className?: string;
}

const NavigationSearch = ({ searchQuery, setSearchQuery, className = "" }: NavigationSearchProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const searchResults = useSearch(searchQuery);

  return (
    <div className={cn("relative", className)}>
      <input
        type="text"
        placeholder="Rechercher..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        className="w-full px-4 py-2 rounded-full bg-secondary/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
      />
      <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
      
      {isFocused && (
        <SearchResults
          results={searchResults}
          onResultClick={() => {
            setIsFocused(false);
            setSearchQuery("");
          }}
          className="w-80"
        />
      )}
      
      {/* Overlay pour fermer les résultats quand on clique en dehors */}
      {isFocused && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsFocused(false)}
        />
      )}
    </div>
  );
};

export default NavigationSearch;
