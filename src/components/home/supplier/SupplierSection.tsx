
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Supplier } from "./types";
import SupplierInfo from "./SupplierInfo";
import ProductionDetails from "./ProductionDetails";
import ColorSamples from "./ColorSamples";
import SupplierContact from "./SupplierContact";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

// Mock supplier to use when database supplier isn't available
const MOCK_SUPPLIER: Supplier = {
  id: "mock-supplier-1",
  company_name: "EcoPrint Solutions",
  contact_name: "Marie Dupont",
  email: "contact@ecoprint.com",
  phone: "+33145678901",
  address: "15 rue de l'Innovation, 75001 Paris",
  description: "Fournisseur spécialisé dans les produits éco-responsables. Nous utilisons des matériaux recyclés et des procédés d'impression écologiques pour garantir une qualité optimale tout en respectant l'environnement.",
  rating: 4.8,
  established_date: "2018"
};

interface SupplierSectionProps {
  productId: string;
}

const SupplierSection = ({ productId }: SupplierSectionProps) => {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSupplier = async () => {
      setLoading(true);
      try {
        // D'abord vérifier si un fournisseur par défaut existe dans product_suppliers
        const { data: productSupplier, error: supplierRelError } = await supabase
          .from('product_suppliers')
          .select('supplier_id')
          .eq('product_id', productId)
          .eq('is_default', true)
          .maybeSingle();

        let supplierId = null;
        
        if (!supplierRelError && productSupplier) {
          // Utiliser le fournisseur par défaut de la relation product_suppliers
          supplierId = productSupplier.supplier_id;
        } else {
          // Sinon, essayer avec l'ancien champ supplier_id sur products_complete
          const { data: productData, error: productError } = await supabase
            .from('products_complete')
            .select('supplier_id')
            .eq('id', productId)
            .single();

          if (!productError && productData?.supplier_id) {
            supplierId = productData.supplier_id;
          }
        }

        // Si nous avons un supplier_id, récupérer les détails du fournisseur
        if (supplierId) {
          const { data: supplierData, error: supplierError } = await supabase
            .from('suppliers')
            .select('*')
            .eq('id', supplierId)
            .single();
            
          if (!supplierError && supplierData) {
            setSupplier(supplierData);
          } else {
            // Utiliser le fournisseur mock en cas d'erreur
            setSupplier(MOCK_SUPPLIER);
          }
        } else {
          // Si aucun fournisseur n'est associé, récupérer un aléatoire
          const { data: randomSupplier, error: suppliersError } = await supabase
            .from('suppliers')
            .select('*')
            .limit(1);
            
          if (!suppliersError && randomSupplier && randomSupplier.length > 0) {
            setSupplier(randomSupplier[0]);
          } else {
            // Utiliser le fournisseur mock en dernier recours
            setSupplier(MOCK_SUPPLIER);
          }
        }
      } catch (err) {
        console.error("Error fetching supplier:", err);
        // Utiliser le fournisseur mock en cas d'erreur
        setSupplier(MOCK_SUPPLIER);
        setError("Impossible de charger les informations du fournisseur");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchSupplier();
    }
  }, [productId]);

  if (!productId) return null;
  
  if (loading) {
    return <LoadingState />;
  }

  if (error && !supplier) {
    return <ErrorState error={error} />;
  }

  if (!supplier) {
    return null;
  }

  return (
    <div className="bg-gray-50 py-12 mt-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Notre fournisseur partenaire</h2>
          <p className="mt-2 text-gray-600">Ce produit est fourni par un partenaire de confiance</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <SupplierInfo supplier={supplier} />
          <ProductionDetails />
          <ColorSamples />
        </div>
        
        <SupplierContact />
      </div>
    </div>
  );
};

export default SupplierSection;
