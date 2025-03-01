
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationSearchProps {
  onClick: () => void;
  className?: string;
}

const NavigationSearch = ({ onClick, className = "" }: NavigationSearchProps) => {
  return (
    <div className={cn("relative", className)}>
      <button 
        onClick={onClick}
        className="p-2 rounded-full hover:bg-secondary/80 transition-colors"
        aria-label="Search"
      >
        <Search className="text-gray-700" size={20} />
      </button>
    </div>
  );
};

export default NavigationSearch;
