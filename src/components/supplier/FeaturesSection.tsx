
import React from "react";
import { Button } from "@/components/ui/button";
import { ProFeature } from "@/types/dashboard";

interface FeaturesSectionProps {
  features: ProFeature[];
}

const FeaturesSection = ({ features }: FeaturesSectionProps) => {
  return (
    <div className="bg-secondary/30 rounded-2xl p-8 md:p-12 mt-8">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Fonctionnalités du tableau de bord fournisseur</h2>
        <p className="text-lg text-gray-600 mb-8">
          Découvrez toutes les fonctionnalités disponibles pour optimiser la gestion de vos produits et améliorer vos ventes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="bg-secondary/50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <feature.icon className="text-accent" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        <Button className="bg-accent hover:bg-accent/80 text-black font-medium py-3 px-8 rounded-full transition-colors shadow-sm">
          Explorer toutes les fonctionnalités
        </Button>
      </div>
    </div>
  );
};

export default FeaturesSection;
