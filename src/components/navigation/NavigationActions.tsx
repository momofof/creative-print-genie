
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface NavigationActionsProps {
  mobile?: boolean;
  onActionClick?: () => void;
  className?: string;
}

const NavigationActions = ({ mobile = false, onActionClick, className }: NavigationActionsProps) => {
  if (mobile) {
    return (
      <div className="pt-4 space-y-2">
        <Link
          to="/login"
          className="block w-full text-center px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={onActionClick}
        >
          Se connecter
        </Link>
        <Link
          to="/signup"
          className="block w-full text-center px-4 py-2 bg-accent text-accent-foreground rounded-full text-sm font-medium hover:bg-accent/90"
          onClick={onActionClick}
        >
          S'inscrire
        </Link>
      </div>
    );
  }

  return (
    <div className={twMerge("hidden lg:flex items-center space-x-4", className)}>
      <Link
        to="/login"
        className="text-sm font-medium text-gray-700 hover:text-accent"
      >
        Se connecter
      </Link>
      <Link
        to="/signup"
        className="text-sm font-medium bg-accent text-accent-foreground px-4 py-2 rounded-full hover:bg-accent/90 transition-colors"
      >
        S'inscrire
      </Link>
    </div>
  );
};

export default NavigationActions;
