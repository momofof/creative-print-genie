
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Building, 
  Truck, 
  ShieldCheck, 
  Clock,
  ThumbsUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Supplier {
  id: string;
  company_name: string;
  contact_name?: string;
  address?: string;
}

interface SupplierSectionProps {
  productId?: string;
}

const SupplierSection = ({ productId }: SupplierSectionProps) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (productId) {
      fetchSuppliers(productId);
    }
  }, [productId]);

  const fetchSuppliers = async (productId: string) => {
    setIsLoading(true);
    try {
      // First get the main supplier for this product
      const { data: productData, error: productError } = await supabase
        .from('products_complete')
        .select('supplier_id')
        .eq('id', productId)
        .single();

      if (productError) {
        console.error("Error fetching product supplier:", productError);
        return;
      }

      // Get the details of the main supplier
      if (productData && productData.supplier_id) {
        const { data: supplierData, error: supplierError } = await supabase
          .from('suppliers')
          .select('*')
          .eq('id', productData.supplier_id);

        if (supplierError) {
          console.error("Error fetching supplier details:", supplierError);
          return;
        }

        // Get additional suppliers for more options
        const { data: additionalSuppliers, error: additionalSuppliersError } = await supabase
          .from('suppliers')
          .select('*')
          .neq('id', productData.supplier_id)
          .limit(3);

        if (additionalSuppliersError) {
          console.error("Error fetching additional suppliers:", additionalSuppliersError);
        }

        const allSuppliers = [
          ...(supplierData || []),
          ...(additionalSuppliers || [])
        ];

        setSuppliers(allSuppliers);
      }
    } catch (error) {
      console.error("Error in fetchSuppliers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!productId || suppliers.length === 0) {
    return null;
  }

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">Nos Fournisseurs Partenaires</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {suppliers.map((supplier) => (
            <div 
              key={supplier.id} 
              className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-center h-16 w-16 bg-accent/10 rounded-full mx-auto mb-4">
                <Building className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">{supplier.company_name}</h3>
              {supplier.address && (
                <p className="text-gray-600 text-sm text-center mb-3">{supplier.address}</p>
              )}
              <div className="flex justify-center items-center gap-2 mb-4">
                <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Certifié
                </span>
                <span className="inline-flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  <ThumbsUp className="w-3 h-3 mr-1" />
                  Recommandé
                </span>
              </div>
              <div className="text-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate(`/suppliers/${supplier.id}`)}
                >
                  <Truck className="w-4 h-4 mr-2" />
                  Voir les produits
                </Button>
              </div>
            </div>
          ))}
        </div>

        {isLoading && (
          <div className="flex justify-center mt-4">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="ml-2 text-sm text-gray-500">Chargement des fournisseurs...</p>
          </div>
        )}

        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/suppliers')}
            className="mx-auto"
          >
            Tous nos fournisseurs
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SupplierSection;
