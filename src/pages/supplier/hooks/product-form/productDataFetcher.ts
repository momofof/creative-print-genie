
import { supabase } from "@/integrations/supabase/client";
import { ProductData, ProductVariant } from "./types";
import { toast } from "sonner";

export const fetchProductData = async (productId: string): Promise<{
  productData: ProductData;
  variants: ProductVariant[];
  imageUrl: string | null;
}> => {
  try {
    // Fetch product data from the products_master table
    const { data: product, error: productError } = await supabase
      .from("products_master")
      .select("*")
      .eq("id", productId)
      .single();
    
    if (productError) throw productError;
    
    if (!product) {
      toast.error("Produit non trouvé");
      throw new Error("Product not found");
    }
    
    // Extract the relevant fields for our ProductData type
    const typedProduct: ProductData = {
      name: product.name,
      price: product.price,
      original_price: product.original_price,
      category: product.category,
      subcategory: product.subcategory,
      description: product.description,
      image: product.image,
      status: product.status as 'draft' | 'published' | 'archived',
      is_customizable: product.is_customizable || false
    };
    
    // Parse variants from the JSONB field
    const parsedVariants: ProductVariant[] = Array.isArray(product.variants) 
      ? product.variants 
      : [];
    
    return {
      productData: typedProduct,
      variants: parsedVariants,
      imageUrl: product.image
    };
  } catch (error: any) {
    console.error("Error fetching product:", error);
    throw error;
  }
};
