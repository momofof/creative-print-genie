
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Updates a specific color variant image for a product
 * @param productId ID of the product
 * @param colorName Name of the color variant (e.g. "rouge")
 * @param imageUrl Full URL of the image
 * @returns boolean indicating success
 */
export const updateProductColorVariantImage = async (
  productId: string,
  colorName: string,
  imageUrl: string
): Promise<boolean> => {
  try {
    // 1. Get the current product data
    const { data: product, error } = await supabase
      .from('unified_products')
      .select('variants, variant_images')
      .eq('id', productId)
      .single();
    
    if (error) {
      console.error('Error retrieving product:', error);
      toast.error('Impossible de récupérer les données du produit');
      return false;
    }
    
    // 2. Find the variant ID for the specified color
    const variants = Array.isArray(product.variants) ? product.variants : [];
    const colorVariant = variants.find(v => 
      v.color && v.color.toLowerCase() === colorName.toLowerCase()
    );
    
    if (!colorVariant) {
      console.error(`No variant found with color ${colorName}`);
      toast.error(`Aucune variante trouvée avec la couleur ${colorName}`);
      return false;
    }
    
    const variantId = colorVariant.id;
    
    // 3. Update the variant_images object
    const currentImages = product.variant_images || {};
    
    // Create a new object to avoid direct mutations
    const updatedImages: Record<string, string[]> = {};
    
    // Copy existing properties
    Object.keys(currentImages).forEach(key => {
      updatedImages[key] = Array.isArray(currentImages[key]) ? [...currentImages[key]] : [];
    });
    
    // Add or update the array for the specific variant
    updatedImages[variantId] = [imageUrl];
    
    // 4. Update the database
    const { error: updateError } = await supabase
      .from('unified_products')
      .update({
        variant_images: updatedImages
      })
      .eq('id', productId);
    
    if (updateError) {
      console.error('Error updating variant images:', updateError);
      toast.error('Impossible de mettre à jour les images de variante');
      return false;
    }
    
    toast.success('Image de variante mise à jour avec succès');
    return true;
  } catch (error) {
    console.error('Error:', error);
    toast.error('Une erreur est survenue');
    return false;
  }
};

/**
 * Gets the bicycle product by name
 * @returns The bicycle product or null if not found
 */
export const getBicycleProduct = async () => {
  try {
    const { data, error } = await supabase
      .from('unified_products')
      .select('*')
      .ilike('name', '%velo%')
      .single();
    
    if (error) {
      console.error('Error retrieving bicycle product:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

/**
 * Initialize the bicycle product variant image
 * Sets the red variant image URL for the bicycle product
 */
export const initializeBicycleVariantImage = async () => {
  const imageUrl = "https://zzcgtdjsmjpfppglcgsm.supabase.co/storage/v1/object/public/product-images/8ece699f7c5e047649377f5db32d587d/rouge.jpg";
  const colorName = "rouge";
  
  // Get the bicycle product
  const product = await getBicycleProduct();
  
  if (!product) {
    console.error('Bicycle product not found');
    toast.error('Produit "vélo" non trouvé');
    return;
  }
  
  // Update the variant image
  await updateProductColorVariantImage(product.id, colorName, imageUrl);
};
