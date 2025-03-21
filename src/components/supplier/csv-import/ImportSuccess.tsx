
import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImportSuccessProps {
  importStatus: {
    total: number;
    success: number;
    failed: number;
  } | null;
  onReset: () => void;
  onClose: () => void;
}

const ImportSuccess = ({ importStatus, onReset, onClose }: ImportSuccessProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="rounded-full bg-green-100 p-3 mb-3">
        <CheckCircle2 className="h-8 w-8 text-green-600" />
      </div>
      <h3 className="text-lg font-semibold mb-1">Importation terminée</h3>
      <p className="text-sm text-gray-500 text-center mb-4">
        {importStatus?.success} produits importés avec succès,{' '}
        {importStatus?.failed} échecs.
      </p>
      <div className="flex space-x-3 w-full">
        <Button variant="outline" onClick={onReset} className="flex-1">
          Importer plus
        </Button>
        <Button onClick={onClose} className="flex-1 bg-teal-600 hover:bg-teal-700">
          Fermer
        </Button>
      </div>
    </div>
  );
};

export default ImportSuccess;
