
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  created_at: string | null;
}

export const useProfileData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    toast.success("Déconnexion réussie");
    navigate("/");
  };

  return { isLoading, profile, handleSignOut };
};
