
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

interface NavigationCartProps {
  onItemClick?: () => void;
  className?: string;
}

const NavigationCart = ({ onItemClick, className = "" }: NavigationCartProps) => {
  return (
    <Link
      to="/cart"
      className={`p-2 rounded-full hover:bg-secondary/80 transition-colors ${className}`}
      aria-label="Shopping Cart"
      onClick={onItemClick}
    >
      <ShoppingCart className="text-gray-700" size={20} />
    </Link>
  );
};

export default NavigationCart;
