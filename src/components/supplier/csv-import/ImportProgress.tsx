
import React from "react";
import { Loader2 } from "lucide-react";

interface ImportProgressProps {
  isLoading: boolean;
  importStatus: {
    total: number;
    success: number;
    failed: number;
  } | null;
}

const ImportProgress = ({ isLoading, importStatus }: ImportProgressProps) => {
  if (!importStatus) return null;
  
  const progress = importStatus ? Math.floor(((importStatus.success + importStatus.failed) / importStatus.total) * 100) : 0;
  
  return (
    <div className="py-6 space-y-6">
      <div className="flex flex-col items-center justify-center">
        {isLoading && (
          <Loader2 className="h-10 w-10 text-teal-600 animate-spin mb-4" />
        )}
        <h3 className="text-lg font-semibold mb-1">
          Importation en cours...
        </h3>
        <p className="text-sm text-gray-500">
          Veuillez patienter pendant l'importation des produits
        </p>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md">
        <div className="flex justify-between text-sm mb-2">
          <span>Total:</span>
          <span className="font-medium">{importStatus.total}</span>
        </div>
        
        {importStatus.success > 0 && (
          <div className="flex justify-between text-sm text-green-600 mb-2">
            <span>Réussis:</span>
            <span className="font-medium">{importStatus.success}</span>
          </div>
        )}
        
        {importStatus.failed > 0 && (
          <div className="flex justify-between text-sm text-red-600">
            <span>Échecs:</span>
            <span className="font-medium">{importStatus.failed}</span>
          </div>
        )}
        
        <div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
          <div
            className="h-full bg-teal-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ImportProgress;
