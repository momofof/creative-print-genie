
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Initialize variant image for specific product (like the bicycle)
 */
export const initializeBicycleVariantImage = async (): Promise<boolean> => {
  try {
    // The bicycle product with the red variant
    const bicycleId = '36'; // Bicycle product ID
    const colorValue = 'Rouge'; // Find the red variant
    
    console.log(`Initializing bicycle variant image for product ID: ${bicycleId}, color: ${colorValue}`);
    
    // First, check if the product exists
    const { data: productData, error: productError } = await supabase
      .from('products_complete')
      .select('*')
      .eq('id', bicycleId)
      .maybeSingle();
    
    if (productError) {
      console.error("Error fetching bicycle product:", productError);
      return false;
    }
    
    if (!productData) {
      console.error(`Bicycle product with ID ${bicycleId} not found`);
      return false;
    }
    
    // Check if color matches
    if (productData.color !== colorValue) {
      console.error(`Bicycle product color doesn't match: ${productData.color} vs ${colorValue}`);
      return false;
    }
    
    // The pre-defined image URL for the red bicycle
    const variantImageUrl = 'https://zzcgtdjsmjpfppglcgsm.supabase.co/storage/v1/object/public/product-images/8ece699f7c5e047649377f5db32d587d/rouge.jpg';
    
    // Update the product with the variant image URL
    const { error: updateError } = await supabase
      .from('products_complete')
      .update({ variant_image_url: variantImageUrl })
      .eq('id', bicycleId);
    
    if (updateError) {
      console.error("Error updating bicycle variant image:", updateError);
      return false;
    }
    
    console.log(`Successfully updated bicycle variant image for product ID: ${bicycleId}`);
    return true;
  } catch (error) {
    console.error("Error in initializeBicycleVariantImage:", error);
    return false;
  }
};
