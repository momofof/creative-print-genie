
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
    // Since we no longer have variant_images or variants, we'll use variant_image_url directly
    const { data, error } = await supabase
      .from('products_complete')
      .select('id, variant_image_url, color')
      .eq('id', productId)
      .single();

    if (error) throw error;
    
    // Create a record with variant IDs as keys
    const variantImages: Record<string, VariantImage[]> = {};
    
    // If there's a variant_image_url, create a single variant image entry
    if (data && data.variant_image_url) {
      // Use color as variant ID or generate one
      const variantId = data.color || 'default';
      
      variantImages[variantId] = [{
        id: '1', // Use a default ID
        product_id: productId,
        variant_id: variantId,
        image_url: data.variant_image_url
      }];
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
    // Since products_complete has no variants field, we'll update variant_image_url directly
    const { error: updateError } = await supabase
      .from('products_complete')
      .update({ 
        variant_image_url: imageUrl,
        // Also update color to match the variant ID if possible
        color: variantId
      })
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
    // Clear the variant_image_url field
    const { error: updateError } = await supabase
      .from('products_complete')
      .update({ 
        variant_image_url: null 
      })
      .eq('id', productId);
      
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error("Error removing variant image:", error);
    return false;
  }
};
