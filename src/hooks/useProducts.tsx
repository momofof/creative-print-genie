
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductComplete } from "@/types/dashboard";
import { toast } from "sonner";

export const fetchProducts = async (): Promise<ProductComplete[]> => {
  try {
    console.log("Fetching products from database...");
    
    // Fetch from products_complete table
    const { data: productsData, error } = await supabase
      .from("products_complete")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
      return [];
    }

    console.log(`Fetched ${productsData.length} products`);
    // Type assertion to ensure compatibility
    return productsData as unknown as ProductComplete[];
  } catch (error) {
    console.error("Error in fetchProducts:", error);
    toast.error("Failed to load products");
    return [];
  }
};

export const useProducts = () => {
  const {
    data: products = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // Function to delete a product
  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from("products_complete")
        .delete()
        .eq("id", productId);
      
      if (error) throw error;
      
      return await refetch();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  return {
    products,
    isLoading,
    error,
    refetch,
    fetchProducts,
    deleteProduct
  };
};
