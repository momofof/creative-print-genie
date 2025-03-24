
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductVariant, Customization, VariantImage } from "@/types/dashboard";
import { toast } from "sonner";

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    console.log("Fetching products from database...");
    
    // Fetch base product data
    const { data: products, error } = await supabase
      .from("unified_products")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
      return [];
    }

    // Now we need to fetch related data for each product
    const enhancedProducts = await Promise.all(
      products.map(async (product) => {
        try {
          // Fetch variants for this product
          const { data: variants, error: variantsError } = await supabase
            .from("product_variants")
            .select("*")
            .eq("product_id", product.id);
          
          if (variantsError) {
            console.error(`Error fetching variants for product ${product.id}:`, variantsError);
            throw variantsError;
          }
          
          // Fetch customizations for this product
          const { data: customizations, error: customizationsError } = await supabase
            .from("product_customizations")
            .select("*")
            .eq("product_id", product.id);
          
          if (customizationsError) {
            console.error(`Error fetching customizations for product ${product.id}:`, customizationsError);
            throw customizationsError;
          }
          
          // Fetch variant images for this product
          const { data: variantImages, error: variantImagesError } = await supabase
            .from("variant_images")
            .select("*")
            .eq("product_id", product.id);
          
          if (variantImagesError) {
            console.error(`Error fetching variant images for product ${product.id}:`, variantImagesError);
            throw variantImagesError;
          }
          
          // Convert to proper types
          const typedVariants: ProductVariant[] = (variants || []).map(v => ({
            ...v,
            status: (v.status as "in_stock" | "low_stock" | "out_of_stock") || "in_stock"
          }));
          
          const typedCustomizations: Customization[] = (customizations || []).map(c => ({
            ...c,
            type: (c.type as "text" | "image") || "text"
          }));
          
          // Return the enhanced product
          return {
            ...product,
            variants: typedVariants || [],
            customizations: typedCustomizations || [],
            variantImages: variantImages as VariantImage[] || []
          };
        } catch (error) {
          console.error(`Error enhancing product ${product.id}:`, error);
          return {
            ...product,
            variants: [],
            customizations: [],
            variantImages: []
          };
        }
      })
    );

    console.log(`Fetched ${enhancedProducts.length} products with related data`);
    return enhancedProducts;
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

  return {
    products,
    isLoading,
    error,
    refetch
  };
};
