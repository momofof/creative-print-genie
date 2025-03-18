
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ProFeature } from "@/types/dashboard";

interface FeaturesSectionProps {
  features: ProFeature[];
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features }) => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Fonctionnalités Pro</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="border border-gray-200 transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-teal-100 p-3 mb-4">
                    {Icon && <Icon className="h-6 w-6 text-teal-600" />}
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
