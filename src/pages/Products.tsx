
import Navigation from "@/components/Navigation";
import { productCategories } from "@/data/productData";
import { useParams } from "react-router-dom";
import CategoryDetailView from "@/components/products/CategoryDetailView";
import CategoriesOverview from "@/components/products/CategoriesOverview";
import ProductList from "@/components/products/ProductList";
import NewArrivalsSection from "@/components/products/NewArrivalsSection";
import PromotionalBanner from "@/components/products/PromotionalBanner";
import DesignServiceBanner from "@/components/products/DesignServiceBanner";
import RecentlyViewedSection from "@/components/products/RecentlyViewedSection";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Products = () => {
  const { categoryId, subcategoryId } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching products for Products page...");
        
        let query = supabase
          .from('products_master')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false });
          
        // Apply filters based on URL parameters
        if (categoryId) {
          query = query.eq('category', categoryId);
          
          if (subcategoryId) {
            query = query.eq('subcategory', subcategoryId);
          }
        }
        
        const { data, error } = await query;
          
        if (error) {
          console.error("Error fetching products:", error);
          toast.error("Impossible de charger les produits");
        } else {
          console.log("Fetched products for Products page:", data);
          console.log("Number of products fetched:", data?.length || 0);
          
          // Map Supabase data to Product type
          const mappedProducts: Product[] = data?.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            originalPrice: item.original_price || item.price,
            image: item.image || '/placeholder.svg',
            category: item.category,
            subcategory: item.subcategory || '',
            description: item.description || '',
            rating: 5, // Default rating
            reviewCount: 0, // Default review count
            color: '',
            date: item.created_at,
            isNew: new Date(item.created_at).getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000), // New if created in the last 7 days
            variants: item.variants // Pass variants from database
          })) || [];
          
          console.log("Mapped products for Products page:", mappedProducts);
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
  }, [categoryId, subcategoryId]);
  
  // Filter categories based on URL parameters
  const displayedCategories = categoryId 
    ? productCategories.filter(cat => cat.id === categoryId) 
    : productCategories;

  // Find the current category if we're on a specific category page
  const currentCategory = categoryId 
    ? productCategories.find(cat => cat.id === categoryId)
    : null;

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {currentCategory ? (
        <>
          <CategoryDetailView category={currentCategory} />
          
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">{subcategoryId || currentCategory.title}</h2>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Chargement...</span>
                </div>
                <p className="mt-2 text-gray-600">Chargement des produits...</p>
              </div>
            ) : (
              <ProductList products={products} />
            )}
          </div>
        </>
      ) : (
        <>
          <CategoriesOverview displayedCategories={displayedCategories} />
          
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Tous nos produits</h2>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Chargement...</span>
                </div>
                <p className="mt-2 text-gray-600">Chargement des produits...</p>
              </div>
            ) : (
              <ProductList products={products} />
            )}
          </div>
        </>
      )}

      {/* Sections promotionnelles placées après la liste de produits pour toutes les vues */}
      <NewArrivalsSection categoryTitle={currentCategory?.title || "Nos produits"} />
      <PromotionalBanner />
      <DesignServiceBanner />
      <RecentlyViewedSection categoryTitle={currentCategory?.title || "Nos produits"} />
    </div>
  );
};

export default Products;
