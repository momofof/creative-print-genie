
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Info, CheckCircle, Truck, Star, Clock } from "lucide-react";

interface Supplier {
  id: string;
  company_name: string;
  contact_name?: string;
  email: string;
  phone?: string;
  address?: string;
  description?: string;
  rating?: number;
  established_date?: string;
}

interface SupplierSectionProps {
  productId: string;
}

const SupplierSection = ({ productId }: SupplierSectionProps) => {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [colors] = useState(['#FF5733', '#33FF57', '#3357FF', '#F3FF33']);

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

        if (productError) throw productError;

        // If the product doesn't have a supplier assigned, get a random one
        if (!productData.supplier_id) {
          const { data: randomSupplier, error: suppliersError } = await supabase
            .from('suppliers')
            .select('*')
            .limit(1);
            
          if (suppliersError) throw suppliersError;
          
          if (randomSupplier && randomSupplier.length > 0) {
            setSupplier(randomSupplier[0]);
          }
        } else {
          // Get the specific supplier for this product
          const { data: supplierData, error: supplierError } = await supabase
            .from('suppliers')
            .select('*')
            .eq('id', productData.supplier_id)
            .single();
            
          if (supplierError) throw supplierError;
          setSupplier(supplierData);
        }
      } catch (err) {
        console.error("Error fetching supplier:", err);
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
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Chargement des informations du fournisseur...</p>
        </div>
      </div>
    );
  }

  if (error || !supplier) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center bg-red-50 p-4 rounded-lg">
          <p className="text-red-600">{error || "Aucun fournisseur disponible"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12 mt-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Notre fournisseur partenaire</h2>
          <p className="mt-2 text-gray-600">Ce produit est fourni par un partenaire de confiance</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Supplier Information */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                <span className="text-2xl font-bold text-teal-600">{supplier.company_name.charAt(0)}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">{supplier.company_name}</h3>
                <p className="text-gray-600">Fournisseur certifié</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-500 mr-2" />
                <span>Note: {supplier.rating || "4.8"}/5</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-blue-500 mr-2" />
                <span>Depuis {supplier.established_date || "2018"}</span>
              </div>
              <div className="flex items-center">
                <Truck className="w-5 h-5 text-green-500 mr-2" />
                <span>Livraison rapide</span>
              </div>
            </div>
            
            <p className="mt-4 text-gray-700">
              {supplier.description || "Fournisseur spécialisé dans les produits personnalisés de haute qualité. Nous travaillons avec les meilleurs matériaux pour garantir votre satisfaction."}
            </p>
          </div>
          
          {/* Production Details */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Détails de production</h3>
            
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                <span>Production écologique et responsable</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                <span>Matériaux de haute qualité</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                <span>Contrôle qualité rigoureux</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                <span>Délai de production rapide</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                <span>Personnalisation avancée</span>
              </li>
            </ul>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center">
                <Info className="w-5 h-5 text-blue-500 mr-2" />
                <p className="text-sm text-gray-600">Temps de production estimé: 3-5 jours ouvrables</p>
              </div>
            </div>
          </div>
          
          {/* Samples and Colors */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Échantillons de couleurs</h3>
            
            <div className="space-y-4">
              <p className="text-gray-700">Couleurs disponibles pour ce produit:</p>
              
              <div className="grid grid-cols-2 gap-3">
                {colors.map((color, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-8 h-8 rounded-full mr-2" 
                      style={{ backgroundColor: color }}
                    ></div>
                    <span className="text-sm">Couleur {index + 1}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-700">
                  D'autres options de couleurs sont disponibles sur demande. 
                  Contactez-nous pour plus d'informations.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-10">
          <p className="text-gray-700 mb-4">Pour plus d'informations sur notre fournisseur:</p>
          <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-md transition-colors">
            Contacter le fournisseur
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplierSection;
