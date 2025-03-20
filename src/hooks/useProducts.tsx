
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('products_master')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error("Error fetching products:", error);
          toast.error("Impossible de charger les produits");
        } else {
          // Map Supabase data to Product type, ensuring all required fields are present
          const mappedProducts: Product[] = data?.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            originalPrice: item.original_price || undefined,
            image: item.image || '/placeholder.svg',
            category: item.category,
            subcategory: item.subcategory || '',
            description: item.description || '',
            // Add the required properties with default values
            rating: 5, // Default rating
            reviewCount: 0, // Default review count
            // Optionally, include additional properties
            color: '',
            date: item.created_at,
            isNew: false,
            // Include variants for later use
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
  }, []);
  
  return { products, isLoading };
};
