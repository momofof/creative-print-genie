
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string | number;
  title: string;
  type: "category" | "subcategory";
  parentCategory?: string;
  link: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  onResultClick: () => void;
  className?: string;
}

const SearchResults = ({ results, onResultClick, className }: SearchResultsProps) => {
  if (results.length === 0) return null;

  return (
    <div className={cn(
      "absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto z-50",
      className
    )}>
      <div className="p-2 space-y-1">
        {results.map((result) => (
          <Link
            key={result.id}
            to={result.link}
            className="block p-2 hover:bg-secondary rounded-md transition-colors"
            onClick={onResultClick}
          >
            <div className="text-sm font-medium">{result.title}</div>
            {result.parentCategory && (
              <div className="text-xs text-gray-500">
                Dans {result.parentCategory}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
