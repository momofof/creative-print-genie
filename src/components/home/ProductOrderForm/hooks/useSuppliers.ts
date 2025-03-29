
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Supplier } from "@/components/home/supplier/types";
import { toast } from "sonner";
import { MOCK_SUPPLIERS } from "../constants/mockData";

export const useSuppliers = (productId?: string, initialSelectedSupplierId?: string | null) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(initialSelectedSupplierId || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [sectionTitle, setSectionTitle] = useState("Choisissez votre fournisseur");

  const fetchSuppliers = async (productId: string) => {
    setLoading(true);
    setError(false);
    
    try {
      // Récupérer le libellé personnalisé du produit
      const { data: productData, error: productLabelError } = await supabase
        .from('products_complete')
        .select('supplier_selection_label')
        .eq('id', productId)
        .single();

      if (!productLabelError && productData?.supplier_selection_label) {
        setSectionTitle(productData.supplier_selection_label);
      }
      
      // Vérifier d'abord si nous avons des fournisseurs associés à ce produit
      const { data: productSuppliers, error: suppliersError } = await supabase
        .from('product_suppliers')
        .select('supplier_id, is_default')
        .eq('product_id', productId);

      if (suppliersError) {
        console.error("Error fetching product suppliers:", suppliersError);
        throw suppliersError;
      }

      let suppliersToShow: Supplier[] = [];
      let defaultSupplierId: string | null = null;
      
      // Si nous avons des fournisseurs dans product_suppliers
      if (productSuppliers && productSuppliers.length > 0) {
        // Trouver l'ID du fournisseur par défaut
        const defaultSupplier = productSuppliers.find(s => s.is_default);
        if (defaultSupplier) {
          defaultSupplierId = defaultSupplier.supplier_id;
        }
        
        // Récupérer les détails de tous les fournisseurs associés
        const supplierIds = productSuppliers.map(s => s.supplier_id);
        
        const { data: supplierDetails, error: detailsError } = await supabase
          .from('suppliers')
          .select('*')
          .in('id', supplierIds);
          
        if (detailsError) {
          throw detailsError;
        }
        
        if (supplierDetails && supplierDetails.length > 0) {
          suppliersToShow = supplierDetails;
        }
      }
      
      // Si aucun fournisseur n'a été trouvé, essayons avec l'ancienne méthode
      if (suppliersToShow.length === 0) {
        // Get product supplier info first
        const { data: productData, error: productError } = await supabase
          .from('products_complete')
          .select('supplier_id')
          .eq('id', productId)
          .single();

        if (!productError && productData?.supplier_id) {
          defaultSupplierId = productData.supplier_id;
          
          const { data: mainSupplier, error: mainSupplierError } = await supabase
            .from('suppliers')
            .select('*')
            .eq('id', defaultSupplierId)
            .single();

          if (!mainSupplierError && mainSupplier) {
            suppliersToShow.push(mainSupplier);
          }
        }
        
        // Get additional suppliers
        const { data: additionalSuppliers, error: otherSuppliersError } = await supabase
          .from('suppliers')
          .select('*')
          .limit(3);

        if (!otherSuppliersError && additionalSuppliers && additionalSuppliers.length > 0) {
          // Filter out the main supplier if it exists
          const filteredSuppliers = defaultSupplierId 
            ? additionalSuppliers.filter(s => s.id !== defaultSupplierId)
            : additionalSuppliers;
          
          suppliersToShow = [...suppliersToShow, ...filteredSuppliers];
        }
      }
      
      // Si toujours aucun fournisseur, utiliser les mocks
      if (suppliersToShow.length === 0) {
        suppliersToShow = MOCK_SUPPLIERS.slice(0, 4);
      }
      
      setSuppliers(suppliersToShow);
      
      // Select the default supplier or the first one if no default supplier
      if (initialSelectedSupplierId) {
        setSelectedSupplierId(initialSelectedSupplierId);
      } else if (suppliersToShow.length > 0 && !selectedSupplierId) {
        const supplierToSelect = defaultSupplierId || suppliersToShow[0].id;
        setSelectedSupplierId(supplierToSelect);
      }
    } catch (error: any) {
      console.error("Error fetching suppliers:", error);
      setError(true);
      setSuppliers(MOCK_SUPPLIERS.slice(0, 4));
      if (MOCK_SUPPLIERS.length > 0 && !selectedSupplierId) {
        setSelectedSupplierId(MOCK_SUPPLIERS[0].id);
      }
      toast.error("Impossible de charger les fournisseurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchSuppliers(productId);
    } else {
      setSuppliers([]);
      setSelectedSupplierId(null);
    }
  }, [productId]);

  return {
    suppliers,
    selectedSupplierId,
    setSelectedSupplierId,
    loading,
    error,
    sectionTitle
  };
};
