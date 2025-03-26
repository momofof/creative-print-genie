
import { useState } from "react";

const ColorSamples = () => {
  const [colors] = useState(['#FF5733', '#33FF57', '#3357FF', '#F3FF33']);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Échantillons de couleurs</h3>
      
      <div className="space-y-4">
        <p className="text-gray-700">Couleurs disponibles pour ce produit:</p>
        
        <div className="grid grid-cols-2 gap-3">
          {colors.map((color, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-8 h-8 rounded-full mr-2" 
                style={{ backgroundColor: color }}
              ></div>
              <span className="text-sm">Couleur {index + 1}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-700">
            D'autres options de couleurs sont disponibles sur demande. 
            Contactez-nous pour plus d'informations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ColorSamples;
