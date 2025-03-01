
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaMicrosoft } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
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
      navigate("/");
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      toast.error(error.message || "Erreur lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook" | "azure") => {
    setSocialLoading(provider);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error(`Erreur de connexion avec ${provider}:`, error);
      toast.error(`Erreur lors de la connexion avec ${provider}`);
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-32 px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Se connecter</h1>
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="space-y-4 mb-6">
              <button
                onClick={() => handleSocialLogin("google")}
                disabled={!!socialLoading}
                className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                {socialLoading === "google" ? (
                  <span>Connexion en cours...</span>
                ) : (
                  <>
                    <FcGoogle className="h-5 w-5 mr-2" />
                    <span>Continuer avec Google</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => handleSocialLogin("facebook")}
                disabled={!!socialLoading}
                className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-[#1877F2] hover:bg-[#166FE5] focus:outline-none"
              >
                {socialLoading === "facebook" ? (
                  <span>Connexion en cours...</span>
                ) : (
                  <>
                    <FaFacebook className="h-5 w-5 mr-2" />
                    <span>Continuer avec Facebook</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => handleSocialLogin("azure")}
                disabled={!!socialLoading}
                className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-[#2F2F2F] hover:bg-[#1E1E1E] focus:outline-none"
              >
                {socialLoading === "azure" ? (
                  <span>Connexion en cours...</span>
                ) : (
                  <>
                    <FaMicrosoft className="h-5 w-5 mr-2" />
                    <span>Continuer avec Microsoft</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou</span>
              </div>
            </div>
            
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-accent text-accent-foreground rounded-full py-2 hover:bg-accent/90 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
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
