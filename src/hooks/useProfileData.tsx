
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

  useEffect(() => {
    const getProfile = async () => {
      setIsLoading(true);
      
      try {
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData.user) {
          // Since profile table is dropped, we use user metadata
          setProfile({
            id: userData.user.id,
            first_name: userData.user.user_metadata.first_name || null,
            last_name: userData.user.user_metadata.last_name || null,
            avatar_url: null,
            created_at: userData.user.created_at
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getProfile();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Déconnexion réussie");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return { isLoading, profile, handleSignOut };
};
