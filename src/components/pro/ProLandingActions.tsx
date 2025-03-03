
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ProLandingActionsProps {
  isLoggedIn: boolean;
}

const ProLandingActions = ({ isLoggedIn }: ProLandingActionsProps) => {
  const navigate = useNavigate();

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
  );
};

export default ProLandingActions;
