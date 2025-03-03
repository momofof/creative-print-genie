
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const ProLanding = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUserSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    
    checkUserSession();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const navigateToSignup = () => {
    navigate("/supplier/register");
  };

  const navigateToLogin = () => {
    navigate("/login");
  };

  const navigateToDashboard = () => {
    navigate("/pro");
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-4">
            <Briefcase className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Espace Fournisseur</h1>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            {isLoggedIn ? (
              <Button 
                size="lg" 
                onClick={navigateToDashboard}
                className="bg-green-600 hover:bg-green-700 text-white px-8"
              >
                Accéder à mon tableau de bord
              </Button>
            ) : (
              <>
                <Button 
                  size="lg" 
                  onClick={navigateToSignup}
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
                >
                  S'inscrire comme fournisseur
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={navigateToLogin}
                >
                  Se connecter
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProLanding;
