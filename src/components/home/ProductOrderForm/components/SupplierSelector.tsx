
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Check, Truck } from "lucide-react";
import { toast } from "sonner";

interface Supplier {
  id: string;
  company_name: string;
  contact_name?: string;
  phone?: string;
  address?: string;
  email: string;
}

interface SupplierSelectorProps {
  productId?: string;
  onSupplierSelect: (supplierId: string) => void;
}

const SupplierSelector = ({ productId, onSupplierSelect }: SupplierSelectorProps) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchSuppliers(productId);
    } else {
      setSuppliers([]);
      setSelectedSupplierId(null);
    }
  }, [productId]);

  const fetchSuppliers = async (productId: string) => {
    setLoading(true);
    try {
      // Get suppliers associated with the selected product
      const { data, error } = await supabase
        .from('products_complete')
        .select('supplier_id')
        .eq('id', productId)
        .single();

      if (error) {
        console.error("Error fetching product information:", error);
        return;
      }

      if (data && data.supplier_id) {
        // Get details of the main supplier
        const { data: supplierData, error: supplierError } = await supabase
          .from('suppliers')
          .select('*')
          .eq('id', data.supplier_id);

        if (supplierError) {
          console.error("Error fetching supplier:", supplierError);
          return;
        }

        // Get some additional suppliers for more choices
        const { data: otherSuppliers, error: otherSuppliersError } = await supabase
          .from('suppliers')
          .select('*')
          .neq('id', data.supplier_id)
          .limit(3);

        if (otherSuppliersError) {
          console.error("Error fetching other suppliers:", otherSuppliersError);
        }

        // Combine the main supplier with other suppliers
        const allSuppliers = [...(supplierData || []), ...(otherSuppliers || [])];
        
        setSuppliers(allSuppliers);
        
        // Select the main supplier by default and notify parent
        if (supplierData && supplierData.length > 0) {
          setSelectedSupplierId(supplierData[0].id);
          onSupplierSelect(supplierData[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      toast.error("Unable to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  const handleSupplierSelect = (supplierId: string) => {
    setSelectedSupplierId(supplierId);
    onSupplierSelect(supplierId);
  };

  if (!productId || suppliers.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h3 className="text-lg font-medium mb-4">Choisissez votre fournisseur</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suppliers.map((supplier) => (
          <div
            key={supplier.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedSupplierId === supplier.id 
                ? "border-teal-500 bg-teal-50" 
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => handleSupplierSelect(supplier.id)}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedSupplierId === supplier.id 
                    ? "bg-teal-500 text-white" 
                    : "bg-gray-100 text-gray-400"
                }`}>
                  {selectedSupplierId === supplier.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Truck className="w-5 h-5" />
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{supplier.company_name}</h4>
                {supplier.address && (
                  <p className="text-sm text-gray-500 mt-1">{supplier.address}</p>
                )}
                <div className="mt-2 flex items-center text-sm">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    selectedSupplierId === supplier.id ? "bg-green-500" : "bg-gray-300"
                  }`}></span>
                  <span className="text-gray-500">Disponible</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-sm text-gray-500">Chargement des fournisseurs...</p>
        </div>
      )}
    </div>
  );
};

export default SupplierSelector;
