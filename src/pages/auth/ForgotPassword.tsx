
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      toast.success("Instructions de réinitialisation envoyées par email");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      console.error("Erreur de réinitialisation:", error);
      toast.error(error.message || "Erreur lors de la réinitialisation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-32 px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Mot de passe oublié</h1>
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <form className="space-y-4" onSubmit={handleResetPassword}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-accent text-accent-foreground rounded-full py-2 hover:bg-accent/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Envoi en cours...
                  </span>
                ) : (
                  "Réinitialiser le mot de passe"
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Vous vous souvenez de votre mot de passe ?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-normal text-accent hover:text-accent/90"
                onClick={() => navigate("/login")}
              >
                Se connecter
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
