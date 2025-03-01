
import Navigation from "@/components/Navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Create = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement
    const checkUserSession = async () => {
      setIsLoading(true);
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        toast.error("Vous devez être connecté pour accéder à cette page");
        navigate("/login");
        return;
      }
      
      setIsLoggedIn(true);
      setIsLoading(false);
    };
    
    checkUserSession();
    
  }, [navigate]);

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
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Créer votre produit</h1>
          <p className="text-xl text-gray-600 mb-8">
            Cette page est en cours de développement. Vous pourrez bientôt créer vos propres produits personnalisés.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Create;
