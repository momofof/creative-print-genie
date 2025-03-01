
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Phone, Store } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  created_at: string | null;
}

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserSession = async () => {
      setIsLoading(true);
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        toast.error("Vous devez être connecté pour accéder à cette page");
        navigate("/login");
        return;
      }
      
      // Fetch profile data
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.session.user.id)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        toast.error("Erreur lors du chargement du profil");
      } else {
        setProfile(profileData);
      }
      
      setIsLoading(false);
    };
    
    checkUserSession();
  }, [navigate]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-32 pb-16 px-4 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-32 pb-16 px-4 max-w-7xl mx-auto">
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Bonjour {profile?.first_name || ""}!</h1>
          <p className="text-gray-600">
            Consultez vos commandes ou modifiez vos informations personnelles. Des questions? Notre service client est là pour vous aider.
            <br />
            Nous sommes heureux de vous aider!
          </p>
        </section>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Card className="bg-gray-50 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Mes Commandes</h2>
                <ChevronRight className="text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-50 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Mon Compte</h2>
                <ChevronRight className="text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full">
                    <Phone className="text-gray-500" size={24} />
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-medium">Des questions? Nous sommes là pour vous aider.</h3>
                  <p className="text-gray-500">Vous avez des questions, nous avons les réponses. Contactez-nous par téléphone ou email.</p>
                </div>
                <div className="flex-shrink-0">
                  <Button variant="outline" className="whitespace-nowrap">
                    Contacter le Service Client
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full">
                    <Store className="text-gray-500" size={24} />
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-medium">Commencez à vendre</h3>
                  <p className="text-gray-500">Vendez et modifiez vos designs ou produits dans l'espace Partenaire.</p>
                </div>
                <div className="flex-shrink-0">
                  <Button variant="outline" className="whitespace-nowrap">
                    Aller à l'espace Partenaire
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-12">
          <Button variant="destructive" onClick={handleSignOut}>
            Se déconnecter
          </Button>
        </div>
        
        <Separator className="my-16" />
        
        <footer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Service</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-accent">Aide</a></li>
              <li><a href="#" className="text-gray-600 hover:text-accent">Contact</a></li>
              <li>
                <p className="text-gray-600">1-800-123-4567</p>
                <p className="text-gray-500 text-sm">Lun - Ven, 8am - 7pm CET</p>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">La Société</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-accent">À propos de nous</a></li>
              <li><a href="#" className="text-gray-600 hover:text-accent">Affiliés</a></li>
              <li><a href="#" className="text-gray-600 hover:text-accent">Presse</a></li>
              <li><a href="#" className="text-gray-600 hover:text-accent">Confidentialité</a></li>
              <li><a href="#" className="text-gray-600 hover:text-accent">Paramètres des données</a></li>
              <li><a href="#" className="text-gray-600 hover:text-accent">Conditions générales</a></li>
              <li><a href="#" className="text-gray-600 hover:text-accent">Mentions légales</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Suivez-nous</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-accent">Facebook</a></li>
              <li><a href="#" className="text-gray-600 hover:text-accent">Twitter</a></li>
              <li><a href="#" className="text-gray-600 hover:text-accent">Instagram</a></li>
              <li><a href="#" className="text-gray-600 hover:text-accent">Pinterest</a></li>
              <li><a href="#" className="text-gray-600 hover:text-accent">Flickr</a></li>
              <li><a href="#" className="text-gray-600 hover:text-accent">Youtube</a></li>
              <li><a href="#" className="text-gray-600 hover:text-accent">Forum</a></li>
              <li><a href="#" className="text-gray-600 hover:text-accent">Blog</a></li>
            </ul>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Profile;
