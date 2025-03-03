
import React from "react";
import { ProFeature } from "@/types/dashboard";
import { Card, CardContent } from "@/components/ui/card";

interface FeaturesSectionProps {
  features: ProFeature[];
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features }) => {
  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">Fonctionnalités</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          
          return (
            <Card key={index} className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 flex items-center justify-center bg-accent/10 rounded-full mb-4">
                    <IconComponent className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-500 text-sm">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturesSection;
