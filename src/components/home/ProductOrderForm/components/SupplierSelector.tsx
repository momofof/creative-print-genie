
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Supplier } from "../../supplier/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info } from "lucide-react";

interface SupplierSelectorProps {
  productId: string;
  onSupplierSelect: (supplierId: string | null) => void;
  initialSupplierId?: string;
}

const SupplierSelector = ({ 
  productId, 
  onSupplierSelect,
  initialSupplierId
}: SupplierSelectorProps) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(initialSupplierId || null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Récupérer la liste des fournisseurs depuis la base de données
  useEffect(() => {
    const fetchSuppliers = async () => {
      setIsLoading(true);
      try {
        // Vérifier d'abord si ce produit a un fournisseur assigné
        let supplierIdToUse = initialSupplierId;
        
        if (!supplierIdToUse) {
          const { data: productData } = await supabase
            .from('products_complete')
            .select('supplier_id')
            .eq('id', productId)
            .single();
            
          if (productData?.supplier_id) {
            supplierIdToUse = productData.supplier_id;
            setSelectedSupplierId(supplierIdToUse);
          }
        }
        
        // Récupérer tous les fournisseurs pour le sélecteur
        const { data, error } = await supabase
          .from('suppliers')
          .select('*')
          .order('company_name');
        
        if (error) {
          console.error("Error fetching suppliers:", error);
          setSuppliers([
            { 
              id: "default-supplier-1", 
              company_name: "EcoPrint Solutions",
              email: "contact@ecoprint.example.com" 
            },
            { 
              id: "default-supplier-2", 
              company_name: "CreativePrint Pro",
              email: "info@creativeprint.example.com" 
            },
            { 
              id: "default-supplier-3", 
              company_name: "Premium Textiles",
              email: "sales@premiumtextiles.example.com" 
            }
          ]);
        } else if (data && data.length > 0) {
          setSuppliers(data);
          
          // Si un fournisseur est déjà assigné, l'utiliser
          if (supplierIdToUse) {
            const exists = data.some(supplier => supplier.id === supplierIdToUse);
            if (exists) {
              setSelectedSupplierId(supplierIdToUse);
              onSupplierSelect(supplierIdToUse);
            } else if (data.length > 0) {
              // Si le fournisseur assigné n'existe pas, utiliser le premier de la liste
              setSelectedSupplierId(data[0].id);
              onSupplierSelect(data[0].id);
            }
          } else if (data.length > 0 && !selectedSupplierId) {
            // Si aucun fournisseur n'est sélectionné, utiliser le premier par défaut
            setSelectedSupplierId(data[0].id);
            onSupplierSelect(data[0].id);
          }
        } else {
          // Aucun fournisseur trouvé dans la base de données, utiliser des valeurs par défaut
          const defaultSuppliers = [
            { 
              id: "default-supplier-1", 
              company_name: "EcoPrint Solutions",
              email: "contact@ecoprint.example.com" 
            },
            { 
              id: "default-supplier-2", 
              company_name: "CreativePrint Pro",
              email: "info@creativeprint.example.com" 
            },
            { 
              id: "default-supplier-3", 
              company_name: "Premium Textiles",
              email: "sales@premiumtextiles.example.com" 
            }
          ];
          setSuppliers(defaultSuppliers);
          
          if (!selectedSupplierId) {
            setSelectedSupplierId(defaultSuppliers[0].id);
            onSupplierSelect(defaultSuppliers[0].id);
          }
        }
      } catch (error) {
        console.error("Error in fetchSuppliers:", error);
        // Utiliser des fournisseurs par défaut en cas d'erreur
        const defaultSuppliers = [
          { 
            id: "default-supplier-1", 
            company_name: "EcoPrint Solutions",
            email: "contact@ecoprint.example.com" 
          },
          { 
            id: "default-supplier-2", 
            company_name: "CreativePrint Pro",
            email: "info@creativeprint.example.com" 
          }
        ];
        setSuppliers(defaultSuppliers);
        
        if (!selectedSupplierId) {
          setSelectedSupplierId(defaultSuppliers[0].id);
          onSupplierSelect(defaultSuppliers[0].id);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchSuppliers();
    }
  }, [productId, onSupplierSelect, initialSupplierId]);

  // Gérer le changement de sélection du fournisseur
  const handleSupplierChange = (value: string) => {
    setSelectedSupplierId(value);
    onSupplierSelect(value);
  };

  if (isLoading) {
    return (
      <div className="mt-4 p-3 bg-gray-50 rounded-md animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="mb-1 flex items-center">
        <label htmlFor="supplier-select" className="block text-sm font-medium text-gray-700">
          Fournisseur
        </label>
        <Info className="h-4 w-4 ml-1 text-gray-400" />
      </div>
      <Select 
        value={selectedSupplierId || undefined} 
        onValueChange={handleSupplierChange}
      >
        <SelectTrigger id="supplier-select" className="w-full">
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
      <p className="mt-1 text-xs text-gray-500">
        Tous nos fournisseurs sont soigneusement sélectionnés pour garantir une qualité optimale.
      </p>
    </div>
  );
};

export default SupplierSelector;
