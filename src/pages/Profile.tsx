
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const Profile = () => {
  const user = useUser();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      toast.error("Vous devez être connecté pour accéder à cette page");
      navigate("/login");
      return;
    }

    // Fetch user profile data
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          toast.error("Erreur lors du chargement du profil");
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Déconnexion réussie");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex justify-center items-center h-[80vh]">
          <div className="animate-pulse">Chargement du profil...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={profile?.avatar_url || ""} alt="Photo de profil" />
                <AvatarFallback className="text-2xl">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-center">
                {profile?.first_name && profile?.last_name 
                  ? `${profile.first_name} ${profile.last_name}`
                  : user?.email || "Utilisateur"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={handleLogout}
              >
                Se déconnecter
              </Button>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{user?.email || "Non renseigné"}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-500">Prénom</p>
                  <p>{profile?.first_name || "Non renseigné"}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-500">Nom</p>
                  <p>{profile?.last_name || "Non renseigné"}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-500">Date d'inscription</p>
                  <p>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString('fr-FR') : "Non renseignée"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
