
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Updates a product with a variant image URL
 * @param productId ID of the product
 * @param imageUrl Full URL of the image
 * @returns boolean indicating success
 */
export const updateProductVariantImage = async (
  productId: string,
  imageUrl: string
): Promise<boolean> => {
  try {
    // Update the product with the variant image URL
    const { error } = await supabase
      .from('products_complete')
      .update({
        variant_image_url: imageUrl
      })
      .eq('id', productId);
    
    if (error) {
      console.error('Error updating variant image URL:', error);
      toast.error('Impossible de mettre à jour l\'image de variante');
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
      .from('products_complete')
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
 * Sets the variant image URL for the bicycle product
 */
export const initializeBicycleVariantImage = async () => {
  const imageUrl = "https://zzcgtdjsmjpfppglcgsm.supabase.co/storage/v1/object/public/product-images/8ece699f7c5e047649377f5db32d587d/rouge.jpg";
  
  // Get the bicycle product
  const product = await getBicycleProduct();
  
  if (!product) {
    console.error('Bicycle product not found');
    toast.error('Produit "vélo" non trouvé');
    return;
  }
  
  // Update the variant image
  await updateProductVariantImage(product.id, imageUrl);
};
