
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Check, Truck } from "lucide-react";
import { toast } from "sonner";
import { Supplier } from "@/components/home/supplier/types";

interface SupplierSelectorProps {
  productId?: string;
  onSupplierSelect: (supplierId: string) => void;
}

// Mock suppliers to use when database suppliers aren't available
const MOCK_SUPPLIERS: Supplier[] = [
  { 
    id: "mock-supplier-1", 
    company_name: "EcoPrint Solutions", 
    contact_name: "Marie Dupont",
    phone: "+33145678901",
    address: "15 rue de l'Innovation, 75001 Paris",
    email: "contact@ecoprint.com" 
  },
  { 
    id: "mock-supplier-2", 
    company_name: "TextilePro France", 
    contact_name: "Jean Martin",
    phone: "+33156789012",
    address: "28 avenue des Artisans, 69002 Lyon",
    email: "info@textilepro.fr" 
  },
  { 
    id: "mock-supplier-3", 
    company_name: "Impression Élite", 
    contact_name: "Sophie Bernard",
    phone: "+33167890123",
    address: "42 boulevard du Commerce, 33000 Bordeaux",
    email: "service@impression-elite.com" 
  },
  { 
    id: "mock-supplier-4", 
    company_name: "ArtDesign Créations", 
    contact_name: "Thomas Petit",
    phone: "+33178901234",
    address: "7 rue des Créateurs, 59000 Lille",
    email: "contact@artdesign.fr" 
  }
];

const SupplierSelector = ({ productId, onSupplierSelect }: SupplierSelectorProps) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("Choisissez votre fournisseur");

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
      // Récupérer le libellé personnalisé du produit
      const { data: productData, error: productLabelError } = await supabase
        .from('products_complete')
        .select('supplier_selection_label')
        .eq('id', productId)
        .single();

      if (!productLabelError && productData?.supplier_selection_label) {
        setSectionTitle(productData.supplier_selection_label);
      }
      
      // Vérifions d'abord si nous avons des fournisseurs associés à ce produit dans la nouvelle table product_suppliers
      const { data: productSuppliers, error: suppliersError } = await supabase
        .from('product_suppliers')
        .select('supplier_id, is_default')
        .eq('product_id', productId);

      if (suppliersError) {
        console.error("Error fetching product suppliers:", suppliersError);
        // Fallback aux fournisseurs mockés
        setSuppliers(MOCK_SUPPLIERS.slice(0, 4));
        setSelectedSupplierId(MOCK_SUPPLIERS[0].id);
        onSupplierSelect(MOCK_SUPPLIERS[0].id);
        setLoading(false);
        return;
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
          
        if (!detailsError && supplierDetails && supplierDetails.length > 0) {
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
      if (suppliersToShow.length > 0) {
        const supplierToSelect = defaultSupplierId || suppliersToShow[0].id;
        setSelectedSupplierId(supplierToSelect);
        onSupplierSelect(supplierToSelect);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      
      // Use mock suppliers in case of error
      setSuppliers(MOCK_SUPPLIERS.slice(0, 4));
      if (MOCK_SUPPLIERS.length > 0) {
        setSelectedSupplierId(MOCK_SUPPLIERS[0].id);
        onSupplierSelect(MOCK_SUPPLIERS[0].id);
      }
      
      toast.error("Impossible de charger les fournisseurs");
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
      <h3 className="text-lg font-medium mb-4">{sectionTitle}</h3>
      
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
