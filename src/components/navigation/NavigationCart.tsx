
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { Badge } from "@/components/ui/badge";

interface NavigationCartProps {
  onItemClick?: () => void;
  className?: string;
}

const NavigationCart = ({ onItemClick, className = "" }: NavigationCartProps) => {
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <Link
      to="/cart"
      className={cn(
        "rounded-full hover:bg-secondary/80 transition-colors flex items-center justify-center relative", 
        className
      )}
      aria-label="Shopping Cart"
      onClick={onItemClick}
    >
      <ShoppingCart className="text-gray-700" size={22} />
      {itemCount > 0 && (
        <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
          {itemCount}
        </Badge>
      )}
    </Link>
  );
};

export default NavigationCart;
