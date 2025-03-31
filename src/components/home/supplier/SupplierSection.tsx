
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
        // First get the product to check if it has a supplier
        const { data: productData, error: productError } = await supabase
          .from('products_complete')
          .select('supplier_id')
          .eq('id', productId)
          .single();

        if (productError) {
          console.error("Error fetching product supplier ID:", productError);
          // Use mock supplier if product fetch fails
          setSupplier(MOCK_SUPPLIER);
          setLoading(false);
          return;
        }

        // If the product doesn't have a supplier assigned, get a random one
        if (!productData.supplier_id) {
          const { data: randomSupplier, error: suppliersError } = await supabase
            .from('suppliers')
            .select('*')
            .limit(1);
            
          if (suppliersError || !randomSupplier || randomSupplier.length === 0) {
            // Use mock supplier if no suppliers in database
            setSupplier(MOCK_SUPPLIER);
          } else {
            setSupplier(randomSupplier[0]);
          }
        } else {
          // Get the specific supplier for this product
          const { data: supplierData, error: supplierError } = await supabase
            .from('suppliers')
            .select('*')
            .eq('id', productData.supplier_id)
            .single();
            
          if (supplierError || !supplierData) {
            // Use mock supplier if specific supplier fetch fails
            setSupplier(MOCK_SUPPLIER);
          } else {
            setSupplier(supplierData);
          }
        }
      } catch (err) {
        console.error("Error fetching supplier:", err);
        // Use mock supplier in case of any error
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
