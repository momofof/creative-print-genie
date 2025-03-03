
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationSearchProps {
  onClick: () => void;
  className?: string;
}

const NavigationSearch = ({ onClick, className = "" }: NavigationSearchProps) => {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "rounded-full hover:bg-secondary/80 transition-colors flex items-center justify-center",
        className
      )}
      aria-label="Search"
    >
      <Search className="text-gray-700" size={22} />
    </button>
  );
};

export default NavigationSearch;
