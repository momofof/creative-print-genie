
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductVariant } from "@/types/product";
import { toast } from "sonner";

// Fetch products from Supabase
export const fetchProductsWithVariants = async (): Promise<Product[]> => {
  try {
    console.log("Fetching products from database...");
    
    // Fetch products from products_complete table
    const { data: productsData, error } = await supabase
      .from('products_complete')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products");
    }
    
    // Map database results to Product type
    const products: Product[] = productsData.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || "",
      price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
      originalPrice: item.original_price ? (typeof item.original_price === 'string' ? parseFloat(item.original_price) : item.original_price) : undefined,
      category: item.category,
      subcategory: item.subcategory || "",
      image: item.image || "/placeholder.svg",
      isNew: false, // Default value
      rating: 5, // Default rating
      reviewCount: 0, // Default review count
      is_customizable: item.is_customizable || false,
      color: item.color || undefined,
      created_at: item.created_at,
      // Convert database variant fields to variants array
      variants: [
        // Create a default variant from the product's own variant fields
        {
          id: `default-${item.id}`,
          product_id: item.id,
          size: item.size || undefined,
          color: item.color || undefined,
          hex_color: item.hex_color || undefined,
          stock: typeof item.stock === 'string' ? parseInt(item.stock) : item.stock,
          price_adjustment: 0, // Default to 0 since it doesn't exist in the table
          status: item.variant_status || 'in_stock',
          bat: item.bat || undefined,
          poids: item.poids || undefined,
          format: item.format || undefined,
          quantite: item.quantite || undefined,
          echantillon: item.echantillon || undefined,
          types_impression: item.types_impression || undefined,
          type_de_materiaux: item.type_de_materiaux || undefined,
          details_impression: item.details_impression || undefined,
          orientation_impression: item.orientation_impression || undefined,
          image_url: item.variant_image_url || item.image,
          created_at: item.created_at,
          updated_at: item.updated_at
        }
      ]
    }));
    
    console.log(`Fetched ${products.length} products with variants`);
    return products;
  } catch (error) {
    console.error("Error in fetchProductsWithVariants:", error);
    throw error;
  }
};

// Hook to use products with variants
export const useProductsWithVariants = () => {
  const {
    data: products = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["productsWithVariants"],
    queryFn: fetchProductsWithVariants,
    meta: {
      onError: (error: any) => {
        console.error("Error fetching products with variants:", error);
        toast.error("Une erreur est survenue lors du chargement des produits");
      }
    }
  });

  return { products, isLoading, error, refetch };
};
