
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/home/HeroSection";
import CategoryPills from "@/components/home/CategoryPills";
import ProductOrderForm from "@/components/home/ProductOrderForm";
import AuthStateWrapper from "@/components/home/AuthStateWrapper";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('products_master')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error("Error fetching products:", error);
          toast.error("Impossible de charger les produits");
        } else {
          console.log("Fetched products:", data);
          
          // Map Supabase data to Product type, adding missing required properties
          const mappedProducts: Product[] = data?.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            originalPrice: item.original_price || undefined,
            image: item.image || '/placeholder.svg',
            category: item.category,
            subcategory: item.subcategory || '',
            description: item.description || '',
            // Add the missing required properties with default values
            rating: 5, // Default rating
            reviewCount: 0, // Default review count
            // Optionally, include additional properties from Supabase
            color: '',
            date: item.created_at,
            isNew: false
          })) || [];
          
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Une erreur est survenue lors du chargement des produits");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  return (
    <AuthStateWrapper>
      <div className="min-h-screen bg-white">
        <Navigation />
        <HeroSection />
        <CategoryPills />
        
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Commandez vos produits personnalisés</h2>
            <p className="mt-2 text-gray-600">Remplissez le formulaire ci-dessous pour passer votre commande</p>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Chargement...</span>
              </div>
              <p className="mt-2 text-gray-600">Chargement des produits...</p>
            </div>
          ) : (
            <ProductOrderForm products={products} />
          )}
          
          <div className="mt-12 text-center">
            <p className="text-gray-700 mb-4">Vous préférez parcourir notre catalogue ?</p>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate('/products')}
              className="px-6"
            >
              Voir tous nos produits
            </Button>
          </div>
        </div>
      </div>
    </AuthStateWrapper>
  );
};

export default Index;
