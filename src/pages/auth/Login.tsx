
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Github, Mail, Facebook, Twitter, Loader2 } from "lucide-react";

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

  const handleSocialLogin = async (provider: "github" | "google" | "facebook" | "twitter") => {
    setSocialLoading(provider);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        throw error;
      }
      
      // La redirection se fait automatiquement par Supabase
    } catch (error: any) {
      console.error(`Erreur de connexion avec ${provider}:`, error);
      
      // Affiche une erreur plus conviviale en fonction du code d'erreur
      if (error.error_code === "validation_failed" && error.msg?.includes("provider is not enabled")) {
        toast.error(`Le fournisseur ${provider} n'est pas activé dans Supabase. Veuillez l'activer dans la console.`);
      } else {
        toast.error(`Erreur lors de la connexion avec ${provider}`);
      }
      
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

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  onClick={() => handleSocialLogin("google")}
                  disabled={socialLoading !== null}
                  style={{ backgroundColor: "#fff", borderColor: "#ddd" }}
                >
                  {socialLoading === "google" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="#4285F4"
                      />
                    </svg>
                  )}
                  <span className="ml-2">Google</span>
                </button>

                <button
                  className="w-full inline-flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50 transition-colors"
                  onClick={() => handleSocialLogin("github")}
                  disabled={socialLoading !== null}
                  style={{ backgroundColor: "#24292e" }}
                >
                  {socialLoading === "github" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Github className="h-5 w-5" />
                  )}
                  <span className="ml-2">GitHub</span>
                </button>

                <button
                  className="w-full inline-flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50 transition-colors"
                  onClick={() => handleSocialLogin("facebook")}
                  disabled={socialLoading !== null}
                  style={{ backgroundColor: "#1877f2" }}
                >
                  {socialLoading === "facebook" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Facebook className="h-5 w-5" />
                  )}
                  <span className="ml-2">Facebook</span>
                </button>

                <button
                  className="w-full inline-flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50 transition-colors"
                  onClick={() => handleSocialLogin("twitter")}
                  disabled={socialLoading !== null}
                  style={{ backgroundColor: "#1da1f2" }}
                >
                  {socialLoading === "twitter" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Twitter className="h-5 w-5" />
                  )}
                  <span className="ml-2">Twitter</span>
                </button>
              </div>
              
              <div className="mt-4 text-xs text-center text-gray-500">
                <p>Pour activer ces boutons de connexion, vous devez configurer les fournisseurs d'authentification dans votre console Supabase.</p>
              </div>
            </div>

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
