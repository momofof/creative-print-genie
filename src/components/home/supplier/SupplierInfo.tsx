
import { Info, Star, Clock, Truck } from "lucide-react";
import { Supplier } from "./types";

interface SupplierInfoProps {
  supplier: Supplier;
}

const SupplierInfo = ({ supplier }: SupplierInfoProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mr-4">
          <span className="text-2xl font-bold text-teal-600">{supplier.company_name.charAt(0)}</span>
        </div>
        <div>
          <h3 className="text-xl font-bold">{supplier.company_name}</h3>
          <p className="text-gray-600">Fournisseur certifié</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center">
          <Star className="w-5 h-5 text-yellow-500 mr-2" />
          <span>Note: {supplier.rating || "4.8"}/5</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-5 h-5 text-blue-500 mr-2" />
          <span>Depuis {supplier.established_date || "2018"}</span>
        </div>
        <div className="flex items-center">
          <Truck className="w-5 h-5 text-green-500 mr-2" />
          <span>Livraison rapide</span>
        </div>
      </div>
      
      <p className="mt-4 text-gray-700">
        {supplier.description || "Fournisseur spécialisé dans les produits personnalisés de haute qualité. Nous travaillons avec les meilleurs matériaux pour garantir votre satisfaction."}
      </p>
    </div>
  );
};

export default SupplierInfo;
