
import React from "react";
import { Phone, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const SupportSection = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full">
                <Phone className="text-gray-500" size={24} />
              </div>
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-medium">Des questions? Nous sommes là pour vous aider.</h3>
              <p className="text-gray-500">Vous avez des questions, nous avons les réponses. Contactez-nous par téléphone ou email.</p>
            </div>
            <div className="flex-shrink-0">
              <Button variant="outline" className="whitespace-nowrap">
                Contacter le Service Client
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full">
                <Store className="text-gray-500" size={24} />
              </div>
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-medium">Commencez à vendre</h3>
              <p className="text-gray-500">Vendez et modifiez vos designs ou produits dans l'espace Partenaire.</p>
            </div>
            <div className="flex-shrink-0">
              <Button variant="outline" className="whitespace-nowrap">
                Aller à l'espace Partenaire
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportSection;
