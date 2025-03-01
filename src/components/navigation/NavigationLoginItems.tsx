
import { Link } from "react-router-dom";
import { UserRound } from "lucide-react";

interface NavigationLoginItemsProps {
  isLoggedIn: boolean;
  onItemClick?: () => void;
  className?: string;
  mobile?: boolean;
}

const NavigationLoginItems = ({ isLoggedIn, onItemClick, className = "", mobile = false }: NavigationLoginItemsProps) => {
  if (mobile) {
    return (
      <div className={className}>
        {isLoggedIn ? (
          <Link
            to="/profile"
            className="flex items-center w-full"
            aria-label="User Profile"
            onClick={onItemClick}
          >
            <UserRound size={18} className="mr-2" />
            <span>Profil</span>
          </Link>
        ) : (
          <Link
            to="/login"
            className="flex items-center w-full"
            aria-label="Login"
            onClick={onItemClick}
          >
            <UserRound size={18} className="mr-2" />
            <span>Connexion</span>
          </Link>
        )}
      </div>
    );
  }
  
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
