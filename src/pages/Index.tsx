
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/home/HeroSection";
import CategoryPills from "@/components/home/CategoryPills";
import ProductOrderForm from "@/components/home/ProductOrderForm";
import AuthStateWrapper from "@/components/home/AuthStateWrapper";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { Product } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [loadCount, setLoadCount] = useState(0); // Used to prevent infinite fetch loops
  
  // Fetch products from Supabase - optimized with useCallback and rate limiting
  const fetchProducts = useCallback(async () => {
    // Prevent excessive fetching (no more than once every 3 seconds)
    if (loadCount > 0 && Date.now() - loadCount < 3000) {
      return;
    }
    
    setLoadCount(Date.now());
    
    try {
      setIsLoading(true);
      setFetchError(false);
      console.log("Fetching products from Supabase...");
      
      const { data, error } = await supabase
        .from('products_master')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
          
      if (error) {
        console.error("Error fetching products:", error);
        toast.error("Impossible de charger les produits");
        setFetchError(true);
        return;
      }
      
      console.log("Number of products fetched:", data?.length || 0);
      
      // Check if we have data before mapping
      if (!data || data.length === 0) {
        setProducts([]);
        return;
      }
      
      // Map Supabase data to Product type, adding missing required properties
      const mappedProducts: Product[] = data.map(item => ({
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
        isNew: false,
        // Include the variants for later use
        variants: item.variants
      }));
      
      setProducts(mappedProducts);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Une erreur est survenue lors du chargement des produits");
      setFetchError(true);
    } finally {
      setIsLoading(false);
    }
  }, [loadCount]);
  
  // Fetch products on mount and on route changes
  useEffect(() => {
    fetchProducts();
    
    // Add event listener to refresh products when user returns to page
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchProducts();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchProducts]);
  
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
          ) : fetchError ? (
            <div className="text-center py-12 bg-red-50 rounded-lg">
              <p className="text-red-700 mb-4">Erreur lors du chargement des produits.</p>
              <Button onClick={fetchProducts} variant="outline" className="mt-2">
                Réessayer
              </Button>
            </div>
          ) : products.length > 0 ? (
            <ProductOrderForm products={products} />
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-700 mb-4">Aucun produit disponible actuellement.</p>
              <p className="text-sm text-gray-500">Veuillez revenir plus tard ou contacter le support.</p>
            </div>
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
