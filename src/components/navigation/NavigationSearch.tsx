
import { useState, useRef, useEffect } from "react";
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
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={cn("relative", className)} ref={searchRef}>
      <input
        type="text"
        placeholder="Rechercher..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        className="w-full px-4 py-2 rounded-full bg-secondary/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
      />
      <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
      
      {isFocused && searchResults.length > 0 && (
        <SearchResults
          results={searchResults}
          onResultClick={() => {
            setIsFocused(false);
            setSearchQuery("");
          }}
          className="absolute z-50 w-full mt-1 max-h-80 overflow-y-auto"
        />
      )}
    </div>
  );
};

export default NavigationSearch;
