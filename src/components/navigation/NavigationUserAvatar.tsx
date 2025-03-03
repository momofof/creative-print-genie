
import { UserRound, Briefcase, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface NavigationUserAvatarProps {
  isSupplier: boolean;
}

const NavigationUserAvatar = ({ isSupplier }: NavigationUserAvatarProps) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error signing out:", error);
        toast.error("Erreur lors de la déconnexion");
      } else {
        toast.success("Déconnexion réussie");
        navigate("/");
      }
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="w-10 h-10 rounded-full"
        >
          <UserRound className="h-5 w-5 text-gray-700" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => navigate("/profile")}>
          <UserRound className="mr-2 h-4 w-4" />
          <span>Profil</span>
        </DropdownMenuItem>
        {isSupplier && (
          <DropdownMenuItem onClick={() => navigate("/pro")}>
            <Briefcase className="mr-2 h-4 w-4" />
            <span>Tableau de bord</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleSignOut} className="text-red-500">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavigationUserAvatar;
