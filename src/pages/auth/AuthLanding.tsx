
import React from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const AuthLanding = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-36 px-4 pb-20">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Bienvenue</h1>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col gap-6">
              <div className="text-center">
                <p className="text-lg text-gray-700 mb-6">
                  Connectez-vous ou créez un compte pour continuer
                </p>
              </div>
              
              <Link to="/login">
                <Button 
                  className="w-full py-6 rounded-lg flex items-center justify-center gap-3"
                  variant="outline"
                >
                  <LogIn size={20} />
                  <span className="text-base font-medium">Se connecter</span>
                </Button>
              </Link>
              
              <Link to="/signup">
                <Button 
                  className="w-full py-6 rounded-lg flex items-center justify-center gap-3 bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <UserPlus size={20} />
                  <span className="text-base font-medium">Créer un compte</span>
                </Button>
              </Link>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  En continuant, vous acceptez nos{" "}
                  <Link to="/terms" className="text-accent hover:underline">
                    conditions d'utilisation
                  </Link>{" "}
                  et notre{" "}
                  <Link to="/privacy" className="text-accent hover:underline">
                    politique de confidentialité
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLanding;
