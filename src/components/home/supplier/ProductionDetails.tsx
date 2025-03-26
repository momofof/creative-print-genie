
import { CheckCircle, Info } from "lucide-react";

const ProductionDetails = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Détails de production</h3>
      
      <ul className="space-y-3">
        <li className="flex items-start">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
          <span>Production écologique et responsable</span>
        </li>
        <li className="flex items-start">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
          <span>Matériaux de haute qualité</span>
        </li>
        <li className="flex items-start">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
          <span>Contrôle qualité rigoureux</span>
        </li>
        <li className="flex items-start">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
          <span>Délai de production rapide</span>
        </li>
        <li className="flex items-start">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
          <span>Personnalisation avancée</span>
        </li>
      </ul>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center">
          <Info className="w-5 h-5 text-blue-500 mr-2" />
          <p className="text-sm text-gray-600">Temps de production estimé: 3-5 jours ouvrables</p>
        </div>
      </div>
    </div>
  );
};

export default ProductionDetails;
