
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
    // Fetch from product_variants table
    const { data, error } = await supabase
      .from('product_variants')
      .select('id, product_id, color, image_url')
      .eq('product_id', productId);

    if (error) throw error;
    
    // Create a record with variant IDs as keys
    const variantImages: Record<string, VariantImage[]> = {};
    
    // Process each variant with image_url
    if (data && data.length > 0) {
      data.forEach(variant => {
        if (variant.image_url) {
          // Use color or id as variant identifier
          const variantId = variant.color || variant.id;
          
          if (!variantImages[variantId]) {
            variantImages[variantId] = [];
          }
          
          variantImages[variantId].push({
            id: variant.id,
            product_id: variant.product_id,
            variant_id: variantId,
            image_url: variant.image_url
          });
        }
      });
    }
    
    // If no variants found in dedicated table, try from products_complete
    if (Object.keys(variantImages).length === 0) {
      const { data: productData, error: productError } = await supabase
        .from('products_complete')
        .select('id, variant_image_url, color')
        .eq('id', productId)
        .single();
  
      if (!productError && productData && productData.variant_image_url) {
        // Use color as variant ID or generate one
        const variantId = productData.color || 'default';
        
        variantImages[variantId] = [{
          id: '1', // Use a default ID
          product_id: productId,
          variant_id: variantId,
          image_url: productData.variant_image_url
        }];
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
    // First check if this variant exists in the new variant table
    const { data: existingVariants, error: checkError } = await supabase
      .from('product_variants')
      .select('id')
      .eq('product_id', productId)
      .eq('id', variantId);
      
    if (checkError) throw checkError;
    
    if (existingVariants && existingVariants.length > 0) {
      // Update existing variant
      const { error: updateError } = await supabase
        .from('product_variants')
        .update({ image_url: imageUrl })
        .eq('id', variantId);
        
      if (updateError) throw updateError;
    } else {
      // Check if there's a variant with this color
      const { data: colorVariants, error: colorCheckError } = await supabase
        .from('product_variants')
        .select('id')
        .eq('product_id', productId)
        .eq('color', variantId);
        
      if (colorCheckError) throw colorCheckError;
      
      if (colorVariants && colorVariants.length > 0) {
        // Update variant with matching color
        const { error: colorUpdateError } = await supabase
          .from('product_variants')
          .update({ image_url: imageUrl })
          .eq('id', colorVariants[0].id);
          
        if (colorUpdateError) throw colorUpdateError;
      } else {
        // Create new variant if none exists
        const { error: insertError } = await supabase
          .from('product_variants')
          .insert({
            product_id: productId,
            color: variantId,
            image_url: imageUrl
          });
          
        if (insertError) throw insertError;
      }
    }
    
    // Also update the main product for backwards compatibility
    const { error: productUpdateError } = await supabase
      .from('products_complete')
      .update({ 
        variant_image_url: imageUrl,
        color: variantId
      })
      .eq('id', productId);
      
    if (productUpdateError) throw productUpdateError;
    
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
    // Find the variant to update
    const { data: variants, error: findError } = await supabase
      .from('product_variants')
      .select('id')
      .eq('product_id', productId)
      .or(`id.eq.${variantId},color.eq.${variantId}`);
      
    if (findError) throw findError;
    
    if (variants && variants.length > 0) {
      // Clear image_url for the variant
      const { error: updateError } = await supabase
        .from('product_variants')
        .update({ image_url: null })
        .eq('id', variants[0].id);
        
      if (updateError) throw updateError;
    }
    
    // Also clear the main product's variant_image_url for backwards compatibility
    const { error: productUpdateError } = await supabase
      .from('products_complete')
      .update({ variant_image_url: null })
      .eq('id', productId);
      
    if (productUpdateError) throw productUpdateError;
    
    return true;
  } catch (error) {
    console.error("Error removing variant image:", error);
    return false;
  }
};
