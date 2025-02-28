
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";

const Create = () => {
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      toast.error("Vous devez être connecté pour accéder à cette page");
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Créer un nouveau produit</h1>
        <p className="text-lg text-gray-600">
          Cette fonctionnalité est en cours de développement. Revenez bientôt !
        </p>
      </div>
    </div>
  );
};

export default Create;
