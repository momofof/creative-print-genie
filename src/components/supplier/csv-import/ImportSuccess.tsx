
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImportSuccessProps {
  importStatus: {
    total: number;
    success: number;
    failed: number;
  } | null;
  onClose: () => void;
}

const ImportSuccess = ({ importStatus, onClose }: ImportSuccessProps) => {
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
      <Button onClick={onClose} className="w-full">
        Fermer
      </Button>
    </div>
  );
};

export default ImportSuccess;
