
import { useState, useEffect } from "react";
import { useProducts } from "./useProducts";
import { useOrders } from "./useOrders";
import { useStats } from "./useStats";
import { supabase } from "@/integrations/supabase/client";
import { Product as DashboardProduct } from "@/types/dashboard";
import { Product as AppProduct } from "@/types/product";
import { toast } from "sonner";
import { parseProductVariants, parseCustomizations } from "@/utils/jsonUtils";

export const useSupplierDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<DashboardProduct[]>([]);
  
  // Use the smaller hooks but only for consumer-facing data
  const { products: consumerProducts } = useProducts();
  const { orders, simulateOrders } = useOrders();
  const { stats, updateProductStats, updateOrderStats } = useStats();

  // Fetch products specifically for the dashboard
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products_master')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error("Erreur lors de la récupération des produits:", error);
        toast.error("Impossible de charger les produits");
        return [];
      } else {
        // Convert products to dashboard format
        const formattedProducts: DashboardProduct[] = data.map(product => {
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
        // Update products list
        setProducts(products.filter(product => product.id !== productId));
        toast.success("Produit supprimé avec succès");
        return true;
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue");
      return false;
    }
  };

  // Load all dashboard data
  const loadDashboardData = async () => {
    setIsLoading(true);
    const fetchedProducts = await fetchProducts();
    const mockOrders = simulateOrders();
    
    // Update stats based on fetched data
    updateProductStats(fetchedProducts);
    updateOrderStats(mockOrders);
    
    setIsLoading(false);
  };

  // Initial data loading
  useEffect(() => {
    loadDashboardData();
  }, []);

  return {
    isLoading,
    products,
    orders,
    stats,
    fetchProducts,
    deleteProduct,
    loadDashboardData
  };
};
