
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast.success("Connexion réussie");
      
      // Check if the user was trying to access the Pro area
      const redirectPath = localStorage.getItem("redirectAfterLogin");
      
      if (redirectPath && redirectPath === "/pro") {
        // For Pro area, we need to check if the user is a supplier
        const { data: supplierData, error: supplierError } = await supabase
          .from('suppliers')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (supplierError || !supplierData) {
          // Not a supplier, redirect to pro landing instead
          localStorage.removeItem("redirectAfterLogin");
          toast.error("Accès réservé aux fournisseurs");
          navigate("/pro-landing");
        } else if (supplierData.status !== 'active') {
          // Supplier account exists but not approved
          localStorage.removeItem("redirectAfterLogin");
          toast.error("Votre compte fournisseur est en attente d'approbation");
          navigate("/pro-landing");
        } else {
          // Valid supplier, allow redirect to Pro
          localStorage.removeItem("redirectAfterLogin");
          navigate(redirectPath);
        }
      } else if (redirectPath) {
        // For non-Pro protected areas, redirect normally
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectPath);
      } else {
        // Default redirect
        navigate("/");
      }
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      toast.error(error.message || "Erreur lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-32 px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Se connecter</h1>
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Mot de passe
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="text-xs text-accent hover:text-accent/90"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-accent text-accent-foreground rounded-full py-2 hover:bg-accent/90 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Connexion en cours...
                  </span>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Pas encore de compte ?{" "}
              <Link to="/signup" className="text-accent hover:text-accent/90">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
