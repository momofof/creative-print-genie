
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Building, 
  Truck, 
  ShieldCheck, 
  Clock,
  ThumbsUp,
  CheckCircle2,
  Globe,
  Flag,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Supplier {
  id: string;
  company_name: string;
  contact_name?: string;
  address?: string;
  country?: string;
  delivery_time?: string;
  rating?: number;
  colors?: string[];
}

interface SupplierSectionProps {
  productId?: string;
}

const SupplierSection = ({ productId }: SupplierSectionProps) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Couleurs de badge pour les fournisseurs
  const countriesWithFlags: Record<string, string> = {
    "France": "🇫🇷",
    "Allemagne": "🇩🇪",
    "Espagne": "🇪🇸",
    "Italie": "🇮🇹",
    "Royaume-Uni": "🇬🇧",
    "Suisse": "🇨🇭",
    "Belgique": "🇧🇪",
    "Canada": "🇨🇦"
  };

  useEffect(() => {
    if (productId) {
      fetchSuppliers(productId);
    } else {
      setSuppliers([]);
      setSelectedSupplierId(null);
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
          .limit(8);

        if (additionalSuppliersError) {
          console.error("Error fetching additional suppliers:", additionalSuppliersError);
        }

        // Enrichir les données des fournisseurs avec des informations supplémentaires pour l'affichage
        const enrichedSuppliers = [...(supplierData || []), ...(additionalSuppliers || [])].map(supplier => ({
          ...supplier,
          country: supplier.address?.includes(",") ? supplier.address.split(",").pop()?.trim() : "France",
          delivery_time: `${Math.floor(Math.random() * 20) + 5} jours`,
          rating: Math.floor(Math.random() * 5) + 3,
          colors: Array.from({length: Math.floor(Math.random() * 8) + 3}, () => 
            `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`)
        }));

        setSuppliers(enrichedSuppliers);
        
        // Sélectionner automatiquement le fournisseur principal
        if (supplierData && supplierData.length > 0) {
          setSelectedSupplierId(supplierData[0].id);
        }
      }
    } catch (error) {
      console.error("Error in fetchSuppliers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupplierSelect = (supplierId: string) => {
    setSelectedSupplierId(supplierId);
  };

  if (!productId || suppliers.length === 0) {
    return null;
  }

  // Diviser les fournisseurs en deux groupes : principaux et autres
  const mainSuppliers = suppliers.slice(0, 2);
  const otherSuppliers = suppliers.slice(2);

  return (
    <section className="py-8 bg-stone-50 border-t border-b border-stone-200">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Sélectionnez une option d'exécution</h2>
        
        {/* Fournisseurs principaux basés en Europe */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-medium">Fournisseurs basés en Europe</h3>
            <span className="inline-flex items-center text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Recommandés
            </span>
          </div>

          <div className="space-y-4">
            {mainSuppliers.map((supplier) => (
              <div 
                key={supplier.id} 
                className={cn(
                  "bg-white rounded-lg border p-4 cursor-pointer transition-all",
                  selectedSupplierId === supplier.id 
                    ? "border-emerald-500 shadow-md" 
                    : "border-gray-200 hover:border-gray-300"
                )}
                onClick={() => handleSupplierSelect(supplier.id)}
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {/* Colonne 1: Logo et informations générales */}
                  <div className="md:col-span-2">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center",
                          selectedSupplierId === supplier.id 
                            ? "bg-emerald-500 text-white" 
                            : "bg-gray-100 text-gray-500"
                        )}>
                          {selectedSupplierId === supplier.id ? (
                            <CheckCircle2 className="h-6 w-6" />
                          ) : (
                            <Building className="h-6 w-6" />
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">{supplier.company_name}</h4>
                          {supplier.country && countriesWithFlags[supplier.country] && (
                            <span title={supplier.country}>{countriesWithFlags[supplier.country]}</span>
                          )}
                          <span className="inline-flex items-center text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                            TOP
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-500 mt-1 space-y-1">
                          <p className="flex items-center gap-1">
                            <span>Basé en</span>
                            <span className="font-medium">{supplier.country || "Europe"}</span>
                          </p>
                          <p className="flex items-center gap-1">
                            <span>Durée de livraison:</span>
                            <span className="font-medium">{supplier.delivery_time}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Colonne 2: Temps de production */}
                  <div>
                    <h5 className="text-xs text-gray-500 mb-1">Temps de production moyen</h5>
                    <p className="font-medium">À partir de 10-15 jours</p>
                  </div>
                  
                  {/* Colonne 3: Zones d'impression */}
                  <div>
                    <h5 className="text-xs text-gray-500 mb-1">Zones d'impression</h5>
                    <p className="font-medium">Recto, Verso, Intérieur de l'étiquette</p>
                  </div>
                  
                  {/* Colonne 4: Couleurs disponibles */}
                  <div>
                    <h5 className="text-xs text-gray-500 mb-1">Couleurs</h5>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {supplier.colors?.slice(0, 8).map((color, index) => (
                        <div 
                          key={index} 
                          className="h-4 w-4 rounded-full border border-gray-200" 
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                      {supplier.colors && supplier.colors.length > 8 && (
                        <div className="text-xs text-blue-600 ml-1 cursor-pointer">
                          +{supplier.colors.length - 8}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Bouton de commande */}
                <div className="mt-3 flex justify-end">
                  <Button 
                    variant="default"
                    size="sm"
                    className="bg-olive-700 hover:bg-olive-800 text-white"
                  >
                    Commander à Commander
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Autres fournisseurs */}
        {otherSuppliers.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center gap-2 mb-4">
              <Flag className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-medium">Autres fournisseurs en dehors de l'Europe</h3>
            </div>
            
            <div className="space-y-4">
              {otherSuppliers.slice(0, 3).map((supplier) => (
                <div 
                  key={supplier.id} 
                  className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:border-gray-300 transition-all"
                  onClick={() => handleSupplierSelect(supplier.id)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Colonne 1: Logo et informations générales */}
                    <div className="md:col-span-2">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-100 text-gray-500">
                            <Building className="h-6 w-6" />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900">{supplier.company_name}</h4>
                            {supplier.country && countriesWithFlags[supplier.country] && (
                              <span title={supplier.country}>{countriesWithFlags[supplier.country]}</span>
                            )}
                          </div>
                          
                          <div className="text-sm text-gray-500 mt-1 space-y-1">
                            <p className="flex items-center gap-1">
                              <span>Complément:</span>
                              <span className="font-medium">Fine</span>
                            </p>
                            <p className="flex items-center gap-1">
                              <span>Livraison:</span>
                              <span className="font-medium">{supplier.delivery_time}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Colonne 2: Production */}
                    <div>
                      <h5 className="text-xs text-gray-500 mb-1">Production</h5>
                      <p className="font-medium">À partir de 15-20 jours</p>
                    </div>
                    
                    {/* Colonne 3: Temps de production */}
                    <div>
                      <h5 className="text-xs text-gray-500 mb-1">Temps de production</h5>
                      <p className="font-medium">14 jours</p>
                    </div>
                    
                    {/* Colonne 4: Couleurs disponibles */}
                    <div>
                      <h5 className="text-xs text-gray-500 mb-1">Couleurs</h5>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {supplier.colors?.slice(0, 8).map((color, index) => (
                          <div 
                            key={index} 
                            className="h-4 w-4 rounded-full border border-gray-200" 
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                        {supplier.colors && supplier.colors.length > 8 && (
                          <div className="text-xs text-blue-600 ml-1 cursor-pointer">
                            +{supplier.colors.length - 8}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Bouton de commande */}
                  <div className="mt-3 flex justify-end">
                    <Button 
                      variant="default"
                      size="sm"
                      className="bg-olive-700 hover:bg-olive-800 text-white"
                    >
                      Commander à Commander
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
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
            Voir tous nos fournisseurs
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SupplierSection;
