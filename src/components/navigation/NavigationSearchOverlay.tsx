
import { useNavigate } from "react-router-dom";

interface SearchResult {
  id: string;
  title: string;
  type: string;
  link: string;
  parentCategory?: string;
}

interface NavigationSearchOverlayProps {
  showSearch: boolean;
  searchQuery: string;
  searchResults: SearchResult[];
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchResultClick: (link: string) => void;
}

const NavigationSearchOverlay = ({
  showSearch,
  searchQuery,
  searchResults,
  onSearchChange,
  onSearchResultClick,
}: NavigationSearchOverlayProps) => {
  if (!showSearch) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-md p-4 animate-fadeIn">
      <div className="max-w-3xl mx-auto">
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={onSearchChange}
          className="w-full px-4 py-2 rounded-full bg-secondary/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
          autoFocus
        />
        
        {searchResults.length > 0 && searchQuery && (
          <div className="mt-4 bg-white rounded-lg shadow-lg border border-gray-100 max-h-96 overflow-y-auto">
            {searchResults.map((result) => (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => onSearchResultClick(result.link)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-none"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{result.title}</p>
                    {result.parentCategory && (
                      <p className="text-sm text-gray-500">
                        dans {result.parentCategory}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 capitalize">
                    {result.type}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationSearchOverlay;
