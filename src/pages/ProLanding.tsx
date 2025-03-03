
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Shield, Star, Settings, Briefcase, Package, LineChart, Truck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProFeature } from "@/types/dashboard";
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

  // Features professionnelles pour la section promo
  const proFeatures: ProFeature[] = [
    {
      title: "Gestion des produits",
      description: "Ajoutez, modifiez et organisez facilement vos produits en ligne",
      icon: Package,
    },
    {
      title: "Suivi des commandes",
      description: "Suivez toutes les commandes et gérez les expéditions efficacement",
      icon: Truck,
    },
    {
      title: "Analyse des ventes",
      description: "Visualisez vos performances et identifiez les tendances commerciales",
      icon: LineChart,
    },
    {
      title: "Gestion des clients",
      description: "Accédez aux informations clients et personnalisez votre approche",
      icon: Users,
    },
  ];

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Espace Professionnel</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Accédez à des outils puissants pour gérer votre activité, suivre vos commandes et développer votre entreprise.
          </p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {proFeatures.map((feature, index) => (
            <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="rounded-full bg-green-100 p-3 inline-flex mb-4">
                  <feature.icon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gray-50 rounded-xl p-8 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Pourquoi devenir fournisseur ?</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Star className="h-6 w-6 text-yellow-500 mr-2 flex-shrink-0 mt-1" />
                  <span>Accès à une clientèle étendue et qualifiée</span>
                </li>
                <li className="flex items-start">
                  <Star className="h-6 w-6 text-yellow-500 mr-2 flex-shrink-0 mt-1" />
                  <span>Outils de gestion professionnels intégrés</span>
                </li>
                <li className="flex items-start">
                  <Star className="h-6 w-6 text-yellow-500 mr-2 flex-shrink-0 mt-1" />
                  <span>Visibilité accrue pour vos produits</span>
                </li>
                <li className="flex items-start">
                  <Star className="h-6 w-6 text-yellow-500 mr-2 flex-shrink-0 mt-1" />
                  <span>Support technique et accompagnement personnalisé</span>
                </li>
              </ul>
              {!isLoggedIn && (
                <Button 
                  className="mt-6 bg-green-600 hover:bg-green-700 text-white" 
                  onClick={navigateToSignup}
                >
                  Devenir fournisseur
                </Button>
              )}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Comment ça marche ?</h3>
              <ol className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="font-semibold text-green-600">1</span>
                  </div>
                  <div>
                    <span className="font-medium">Inscrivez-vous</span>
                    <p className="text-gray-600 text-sm mt-1">Créez votre compte professionnel en quelques minutes</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="font-semibold text-green-600">2</span>
                  </div>
                  <div>
                    <span className="font-medium">Ajoutez vos produits</span>
                    <p className="text-gray-600 text-sm mt-1">Importez ou créez votre catalogue de produits</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="font-semibold text-green-600">3</span>
                  </div>
                  <div>
                    <span className="font-medium">Gérez vos commandes</span>
                    <p className="text-gray-600 text-sm mt-1">Suivez et expédiez vos commandes depuis le tableau de bord</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="font-semibold text-green-600">4</span>
                  </div>
                  <div>
                    <span className="font-medium">Développez votre activité</span>
                    <p className="text-gray-600 text-sm mt-1">Analysez vos performances et optimisez vos ventes</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {!isLoggedIn && (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Prêt à commencer ?</h2>
            <Button 
              size="lg" 
              onClick={navigateToSignup}
              className="bg-green-600 hover:bg-green-700 text-white px-8"
            >
              Créer un compte professionnel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProLanding;
