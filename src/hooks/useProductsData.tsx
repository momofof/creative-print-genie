
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { toast } from "sonner";

export const useProductsData = (categoryId?: string, subcategoryId?: string) => {
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
  
  return { products, isLoading };
};
