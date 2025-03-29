
import { useSuppliers } from "../hooks/useSuppliers";
import SupplierCard from "./supplier/SupplierCard";
import SupplierLoadingState from "./supplier/SupplierLoadingState";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface SupplierSelectorProps {
  productId?: string;
  onSupplierSelect: (supplierId: string) => void;
  selectedSupplierId: string | null;
}

const SupplierSelector = ({ 
  productId, 
  onSupplierSelect,
  selectedSupplierId: externalSelectedSupplierId
}: SupplierSelectorProps) => {
  const { suppliers, selectedSupplierId, setSelectedSupplierId, loading, error, sectionTitle } = useSuppliers(productId, externalSelectedSupplierId);

  const handleSupplierSelect = (supplierId: string) => {
    setSelectedSupplierId(supplierId);
    onSupplierSelect(supplierId);
  };

  if (!productId) {
    return null;
  }

  if (error) {
    return (
      <div className="mt-6 pt-6 border-t border-gray-200">
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>
            Impossible de charger les fournisseurs. Veuillez réessayer.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (suppliers.length === 0 && !loading) {
    return null;
  }

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h3 className="text-lg font-medium mb-4">{sectionTitle}</h3>
      
      {loading ? (
        <SupplierLoadingState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suppliers.map((supplier) => (
            <SupplierCard
              key={supplier.id}
              supplier={supplier}
              isSelected={selectedSupplierId === supplier.id}
              onSelect={handleSupplierSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SupplierSelector;
