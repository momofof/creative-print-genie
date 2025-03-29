
import { Loader2 } from "lucide-react";

const SupplierLoadingState = () => {
  return (
    <div className="text-center py-4">
      <Loader2 className="h-6 w-6 animate-spin text-accent mx-auto" />
      <p className="mt-2 text-sm text-gray-500">Chargement des fournisseurs...</p>
    </div>
  );
};

export default SupplierLoadingState;
