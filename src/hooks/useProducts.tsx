
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/dashboard";
import { toast } from "sonner";
import { parseProductVariants, parseCustomizations } from "@/utils/jsonUtils";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Set up real-time subscription for products
  useEffect(() => {
    const productsSubscription = supabase
      .channel('public:products_master:supplier_dashboard')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'products_master'
        }, 
        (payload) => {
          console.log('Real-time supplier dashboard update received:', payload);
          
          // Refresh products after any change
          fetchProducts();
        }
      )
      .subscribe();
      
    // Initial fetch
    fetchProducts();
      
    // Clean up subscription when component unmounts
    return () => {
      productsSubscription.unsubscribe();
    };
  }, []);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products_master')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erreur lors de la récupération des produits:", error);
        toast.error("Impossible de charger les produits");
        return [];
      } else {
        // Convert products from unified format to our interface format
        const formattedProducts: Product[] = data.map(product => {
          return {
            ...product,
            // Ensure status is one of the expected values
            status: (product.status === 'draft' || product.status === 'published' || product.status === 'archived') 
              ? product.status 
              : 'draft',
            // Parse variants and customizations
            variants: parseProductVariants(product.variants),
            customizations: parseCustomizations(product.customizations),
          };
        });
        
        // Update products state
        setProducts(formattedProducts);
        setIsLoading(false);
        return formattedProducts;
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue");
      setIsLoading(false);
      return [];
    }
  };

  // Delete a product
  const deleteProduct = async (productId: string) => {
    try {
      // Display confirmation
      if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
        return false;
      }
      
      // Delete the product from the master table
      const { error } = await supabase
        .from('products_master')
        .delete()
        .eq('id', productId);
        
      if (error) {
        console.error("Erreur lors de la suppression:", error);
        toast.error("Impossible de supprimer le produit");
        return false;
      } else {
        // Update is handled by the real-time subscription now
        toast.success("Produit supprimé avec succès");
        return true;
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue");
      return false;
    }
  };

  return {
    products,
    isLoading,
    fetchProducts,
    deleteProduct
  };
};
