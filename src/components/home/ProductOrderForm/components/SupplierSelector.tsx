
import { useSuppliers } from "../hooks/useSuppliers";
import SupplierCard from "./supplier/SupplierCard";
import SupplierLoadingState from "./supplier/SupplierLoadingState";

interface SupplierSelectorProps {
  productId?: string;
  onSupplierSelect: (supplierId: string) => void;
}

const SupplierSelector = ({ productId, onSupplierSelect }: SupplierSelectorProps) => {
  const { suppliers, selectedSupplierId, setSelectedSupplierId, loading, sectionTitle } = useSuppliers(productId);

  const handleSupplierSelect = (supplierId: string) => {
    setSelectedSupplierId(supplierId);
    onSupplierSelect(supplierId);
  };

  if (!productId || suppliers.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h3 className="text-lg font-medium mb-4">{sectionTitle}</h3>
      
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
      
      {loading && <SupplierLoadingState />}
    </div>
  );
};

export default SupplierSelector;
