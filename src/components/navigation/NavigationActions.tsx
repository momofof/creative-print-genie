import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser } from "@supabase/auth-helpers-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavigationActionsProps {
  className?: string;
  mobile?: boolean;
  onActionClick?: () => void;
}

const NavigationActions = ({ className, mobile, onActionClick }: NavigationActionsProps) => {
  const user = useUser();
  
  if (!user) {
    return (
      <div className={`flex items-center gap-4 ${className || ""}`}>
        <Link to="/login" onClick={onActionClick}>
          <Button variant="ghost" size="sm">
            Se connecter
          </Button>
        </Link>
        <Link to="/signup" onClick={onActionClick}>
          <Button size="sm">S'inscrire</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className={`flex items-center gap-4 ${className || ""}`}>
      <Link to="/profile" onClick={onActionClick}>
        <Avatar className="h-9 w-9 cursor-pointer hover:opacity-80 transition-opacity">
          <AvatarFallback>{user.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
        </Avatar>
      </Link>
    </div>
  );
};

export default NavigationActions;
