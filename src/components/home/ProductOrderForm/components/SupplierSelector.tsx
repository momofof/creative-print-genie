
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Supplier } from "@/components/home/supplier/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SupplierSelectorProps {
  productId: string;
  onSupplierSelect: (supplierId: string | null) => void;
}

const SupplierSelector = ({ productId, onSupplierSelect }: SupplierSelectorProps) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // First, try to fetch suppliers who have this specific product
        let { data: productSuppliers, error: productSupplierError } = await supabase
          .from('supplier_products')
          .select('supplier_id')
          .eq('product_id', productId);
        
        if (productSupplierError) {
          console.error("Error fetching product suppliers:", productSupplierError);
          throw productSupplierError;
        }
        
        if (productSuppliers && productSuppliers.length > 0) {
          // Get the supplier IDs
          const supplierIds = productSuppliers.map(ps => ps.supplier_id);
          
          // Fetch the actual supplier details
          const { data: supplierDetails, error: supplierDetailsError } = await supabase
            .from('suppliers')
            .select('*')
            .in('id', supplierIds);
            
          if (supplierDetailsError) {
            console.error("Error fetching supplier details:", supplierDetailsError);
            throw supplierDetailsError;
          }
          
          setSuppliers(supplierDetails || []);
        } else {
          // If no specific suppliers for this product, fetch all suppliers
          const { data: allSuppliers, error: allSuppliersError } = await supabase
            .from('suppliers')
            .select('*')
            .order('company_name', { ascending: true });
            
          if (allSuppliersError) {
            console.error("Error fetching all suppliers:", allSuppliersError);
            throw allSuppliersError;
          }
          
          setSuppliers(allSuppliers || []);
        }
      } catch (error) {
        console.error("Error in fetchSuppliers:", error);
        setError("Impossible de charger les fournisseurs");
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchSuppliers();
    } else {
      setSuppliers([]);
    }
  }, [productId]);

  const handleSupplierChange = (value: string) => {
    setSelectedSupplierId(value);
    onSupplierSelect(value);
  };

  return (
    <div className="my-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Choisissez un fournisseur
      </label>
      
      {isLoading ? (
        <div className="text-center py-3 bg-gray-50 rounded">
          <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <span className="ml-2 text-sm text-gray-600">Chargement des fournisseurs...</span>
        </div>
      ) : error ? (
        <div className="text-center py-3 bg-red-50 rounded">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      ) : suppliers.length === 0 ? (
        <div className="text-center py-3 bg-yellow-50 rounded">
          <p className="text-yellow-700 text-sm">Aucun fournisseur disponible pour ce produit.</p>
        </div>
      ) : (
        <Select onValueChange={handleSupplierChange} value={selectedSupplierId || ""}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un fournisseur" />
          </SelectTrigger>
          <SelectContent>
            {suppliers.map((supplier) => (
              <SelectItem key={supplier.id} value={supplier.id}>
                {supplier.company_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default SupplierSelector;
