
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileCards from "@/components/profile/ProfileCards";
import SupportSection from "@/components/profile/SupportSection";
import ProfileFooter from "@/components/profile/ProfileFooter";
import LoadingSpinner from "@/components/profile/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Profile = () => {
  const { isLoggedIn, userId, signOut, checkingAuth } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isLoggedIn && !checkingAuth) {
        toast.error("Vous devez être connecté pour accéder à cette page");
        navigate("/auth");
        return;
      }

      if (userId) {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

          if (error) {
            throw error;
          }

          setProfile(data);
        } catch (error) {
          console.error("Error fetching profile:", error);
          toast.error("Erreur lors du chargement du profil");
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (!checkingAuth) {
      fetchProfile();
    }
  }, [userId, isLoggedIn, checkingAuth, navigate]);

  if (checkingAuth || isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-32 pb-16 px-4 max-w-7xl mx-auto">
        <ProfileHeader firstName={profile?.first_name} />
        <ProfileCards />
        <SupportSection />
        
        <div className="mt-12">
          <Button variant="destructive" onClick={signOut}>
            Se déconnecter
          </Button>
        </div>
        
        <Separator className="my-16" />
        
        <ProfileFooter />
      </main>
    </div>
  );
};

export default Profile;
