
import { supabase } from "@/integrations/supabase/client";

export interface VariantImage {
  id: string;
  product_id: string;
  variant_id: string;
  image_url: string;
  created_at?: string;
}

// Function to get all variant images for a product
export const getProductVariantImages = async (productId: string): Promise<Record<string, VariantImage[]>> => {
  try {
    // Since variant_images table doesn't exist in the TypeScript type definitions, 
    // we need to use a type assertion
    const { data, error } = await supabase
      .from('products_complete') // Use products_complete as a substitute
      .select('id, variants')
      .eq('id', productId)
      .single() as unknown as { 
        data: { id: string, variants: any[] } | null, 
        error: Error | null 
      };

    if (error) throw error;
    
    // Simulate returning variant images from product data
    const variantImages: Record<string, VariantImage[]> = {};
    
    // Try to extract variant images from the product's variants field
    if (data && data.variants) {
      // Parse variants if needed
      const variants = typeof data.variants === 'string' 
        ? JSON.parse(data.variants) 
        : data.variants;
      
      // Create a record with variant IDs as keys
      if (Array.isArray(variants)) {
        variants.forEach((variant, index) => {
          if (variant.id && variant.image_url) {
            variantImages[variant.id] = [{
              id: `${index}`,
              product_id: productId,
              variant_id: variant.id,
              image_url: variant.image_url
            }];
          }
        });
      }
    }
    
    return variantImages;
  } catch (error) {
    console.error("Error retrieving variant images:", error);
    return {};
  }
};

// Function to add/update variant images
export const updateVariantImages = async (
  productId: string,
  variantId: string,
  imageUrl: string
): Promise<boolean> => {
  try {
    // Since variant_images doesn't exist, we need to update the product's variants directly
    // First, get the current product data
    const { data: productData, error: fetchError } = await supabase
      .from('products_complete')
      .select('variants')
      .eq('id', productId)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Parse variants
    let variants = [];
    if (productData.variants) {
      variants = typeof productData.variants === 'string' 
        ? JSON.parse(productData.variants) 
        : productData.variants;
    }
    
    // Find the variant and update or add image_url
    let variantUpdated = false;
    if (Array.isArray(variants)) {
      for (const variant of variants) {
        if (variant.id === variantId) {
          variant.image_url = imageUrl;
          variantUpdated = true;
          break;
        }
      }
      
      // If variant not found, add it
      if (!variantUpdated) {
        variants.push({
          id: variantId,
          image_url: imageUrl
        });
      }
    } else {
      // Create new variants array
      variants = [{
        id: variantId,
        image_url: imageUrl
      }];
    }
    
    // Update the product with the modified variants
    const { error: updateError } = await supabase
      .from('products_complete')
      .update({ variants: variants })
      .eq('id', productId);
      
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error("Error updating variant image:", error);
    return false;
  }
};

// Function to remove a variant image
export const removeVariantImage = async (
  productId: string,
  variantId: string,
  imageUrl: string
): Promise<boolean> => {
  try {
    // Get the current product data
    const { data: productData, error: fetchError } = await supabase
      .from('products_complete')
      .select('variants')
      .eq('id', productId)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Parse variants
    let variants = [];
    if (productData.variants) {
      variants = typeof productData.variants === 'string' 
        ? JSON.parse(productData.variants) 
        : productData.variants;
    }
    
    // Find the variant and remove the image_url
    if (Array.isArray(variants)) {
      for (const variant of variants) {
        if (variant.id === variantId && variant.image_url === imageUrl) {
          variant.image_url = null;
          break;
        }
      }
      
      // Update the product with the modified variants
      const { error: updateError } = await supabase
        .from('products_complete')
        .update({ variants: variants })
        .eq('id', productId);
        
      if (updateError) throw updateError;
    }
    
    return true;
  } catch (error) {
    console.error("Error removing variant image:", error);
    return false;
  }
};
