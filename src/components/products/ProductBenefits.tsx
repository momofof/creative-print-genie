
import React from "react";
import { Truck, RotateCw, ShieldCheck } from "lucide-react";

const ProductBenefits = () => {
  return (
    <div className="space-y-4 mb-6 text-sm text-gray-700">
      <div className="flex items-start gap-3">
        <Truck className="w-5 h-5 text-gray-500 mt-0.5" />
        <div>
          <p className="font-medium">Livraison gratuite</p>
          <p>Pour les commandes supérieures à 50€</p>
        </div>
      </div>
      
      <div className="flex items-start gap-3">
        <RotateCw className="w-5 h-5 text-gray-500 mt-0.5" />
        <div>
          <p className="font-medium">Retours sous 30 jours</p>
          <p>Retours sans frais dans les 30 jours</p>
        </div>
      </div>
      
      <div className="flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-gray-500 mt-0.5" />
        <div>
          <p className="font-medium">Qualité garantie</p>
          <p>Satisfaction garantie ou remboursement</p>
        </div>
      </div>
    </div>
  );
};

export default ProductBenefits;
