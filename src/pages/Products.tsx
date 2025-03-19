
import Navigation from "@/components/Navigation";
import { productCategories, allProducts } from "@/data/productData";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import CategoryDetailView from "@/components/products/CategoryDetailView";
import CategoriesOverview from "@/components/products/CategoriesOverview";
import ProductList from "@/components/products/ProductList";
import NewArrivalsSection from "@/components/products/NewArrivalsSection";
import PromotionalBanner from "@/components/products/PromotionalBanner";
import DesignServiceBanner from "@/components/products/DesignServiceBanner";
import RecentlyViewedSection from "@/components/products/RecentlyViewedSection";

const Products = () => {
  const { categoryId, subcategoryId } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch products from Supabase and subscribe to real-time updates
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        
        let query = supabase
          .from('products_master')
          .select('*')
          .eq('status', 'published');
          
        // Add filters based on URL parameters
        if (categoryId) {
          query = query.eq('category', categoryId);
          
          if (subcategoryId) {
            query = query.eq('subcategory', subcategoryId);
          }
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
          
        if (error) {
          console.error("Error fetching products:", error);
          toast.error("Impossible de charger les produits");
        } else {
          console.log("Fetched products:", data);
          
          // Map Supabase data to Product type
          const mappedProducts: Product[] = data?.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            originalPrice: item.original_price || item.price, // Ensure originalPrice is always a value
            image: item.image || '/placeholder.svg',
            category: item.category,
            subcategory: item.subcategory || '',
            description: item.description || '',
            rating: 5, // Default rating
            reviewCount: 0, // Default review count
            color: '',
            date: item.created_at,
            isNew: false,
            variants: item.variants
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
    
    // Set up real-time subscription for products_master table
    const productsSubscription = supabase
      .channel('public:products_master:catalog')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'products_master',
          filter: 'status=published'
        }, 
        (payload) => {
          console.log('Real-time catalog update received:', payload);
          
          // Handle different types of changes
          if (payload.eventType === 'INSERT') {
            const newProduct = payload.new;
            
            // Check if the new product matches the current category/subcategory filter
            if ((categoryId && newProduct.category !== categoryId) || 
                (subcategoryId && newProduct.subcategory !== subcategoryId)) {
              return; // Skip products that don't match the current filter
            }
            
            // Map new product to Product type
            const mappedNewProduct: Product = {
              id: newProduct.id,
              name: newProduct.name,
              price: newProduct.price,
              originalPrice: newProduct.original_price || newProduct.price,
              image: newProduct.image || '/placeholder.svg',
              category: newProduct.category,
              subcategory: newProduct.subcategory || '',
              description: newProduct.description || '',
              rating: 5, // Default rating
              reviewCount: 0, // Default review count
              color: '',
              date: newProduct.created_at,
              isNew: true, // Mark as new
              variants: newProduct.variants
            };
            
            toast.success(`Nouveau produit ajouté: ${newProduct.name}`);
            setProducts(prev => [mappedNewProduct, ...prev]);
          } 
          else if (payload.eventType === 'UPDATE') {
            const updatedProduct = payload.new;
            
            // Update existing product (if it matches the current filter)
            if ((categoryId && updatedProduct.category !== categoryId) || 
                (subcategoryId && updatedProduct.subcategory !== subcategoryId)) {
              // If the updated product no longer matches the filter, remove it
              setProducts(prev => prev.filter(p => p.id !== updatedProduct.id));
              return;
            }
            
            setProducts(prev => prev.map(product => 
              product.id === updatedProduct.id ? 
              {
                ...product,
                name: updatedProduct.name,
                price: updatedProduct.price,
                originalPrice: updatedProduct.original_price || updatedProduct.price,
                image: updatedProduct.image || '/placeholder.svg',
                category: updatedProduct.category,
                subcategory: updatedProduct.subcategory || '',
                description: updatedProduct.description || '',
                variants: updatedProduct.variants
              } : product
            ));
          }
          else if (payload.eventType === 'DELETE') {
            const deletedProductId = payload.old.id;
            setProducts(prev => prev.filter(product => product.id !== deletedProductId));
          }
        }
      )
      .subscribe();
      
    // Clean up subscription when component unmounts
    return () => {
      productsSubscription.unsubscribe();
    };
  }, [categoryId, subcategoryId]);
  
  // Find the current category if we're on a specific category page
  const currentCategory = categoryId 
    ? productCategories.find(cat => cat.id === categoryId)
    : null;
    
  // Display categories based on URL parameters
  const displayedCategories = categoryId 
    ? productCategories.filter(cat => cat.id === categoryId) 
    : productCategories;

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Chargement...</span>
          </div>
          <p className="ml-3 text-gray-600">Chargement des produits...</p>
        </div>
      ) : (
        <>
          {currentCategory ? (
            <>
              <CategoryDetailView category={currentCategory} />
              
              <div className="max-w-7xl mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-6">{subcategoryId || currentCategory.title}</h2>
                <ProductList products={products} />
              </div>
            </>
          ) : (
            <>
              <CategoriesOverview displayedCategories={displayedCategories} />
              
              <div className="max-w-7xl mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-6">Tous nos produits</h2>
                <ProductList products={products} />
              </div>
            </>
          )}

          {/* Sections promotionnelles placées après la liste de produits pour toutes les vues */}
          <NewArrivalsSection categoryTitle={currentCategory?.title || "Nos produits"} />
          <PromotionalBanner />
          <DesignServiceBanner />
          <RecentlyViewedSection categoryTitle={currentCategory?.title || "Nos produits"} />
        </>
      )}
    </div>
  );
};

export default Products;
