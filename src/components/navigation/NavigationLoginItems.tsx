
import { Link } from "react-router-dom";
import { UserRound } from "lucide-react";

interface NavigationLoginItemsProps {
  isLoggedIn: boolean;
  onItemClick?: () => void;
  className?: string;
}

const NavigationLoginItems = ({ isLoggedIn, onItemClick, className = "" }: NavigationLoginItemsProps) => {
  return (
    <div className={className}>
      {isLoggedIn ? (
        <Link
          to="/profile"
          className="p-2 rounded-full hover:bg-secondary/80 transition-colors"
          aria-label="User Profile"
          onClick={onItemClick}
        >
          <UserRound className="text-gray-700" size={20} />
        </Link>
      ) : (
        <Link
          to="/login"
          className="p-2 rounded-full hover:bg-secondary/80 transition-colors"
          aria-label="Login"
          onClick={onItemClick}
        >
          <UserRound className="text-gray-700" size={20} />
        </Link>
      )}
    </div>
  );
};

export default NavigationLoginItems;
