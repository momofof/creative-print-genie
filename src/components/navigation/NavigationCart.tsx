
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationCartProps {
  onItemClick?: () => void;
  className?: string;
}

const NavigationCart = ({ onItemClick, className = "" }: NavigationCartProps) => {
  return (
    <Link
      to="/cart"
      className={cn(
        "rounded-full hover:bg-secondary/80 transition-colors flex items-center justify-center", 
        className
      )}
      aria-label="Shopping Cart"
      onClick={onItemClick}
    >
      <ShoppingCart className="text-gray-700" size={22} />
    </Link>
  );
};

export default NavigationCart;
