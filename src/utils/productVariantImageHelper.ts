
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

// Define a Variant interface that matches the expected structure
interface Variant {
  id: string;
  color?: string;
  [key: string]: any;
}

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
    let variants: Variant[] = [];
    
    if (product.variants) {
      if (typeof product.variants === 'string') {
        try {
          variants = JSON.parse(product.variants);
        } catch (e) {
          console.error('Error parsing variants:', e);
          variants = [];
        }
      } else if (Array.isArray(product.variants)) {
        variants = product.variants as Variant[];
      }
    }
    
    const colorVariant = variants.find(v => 
      v.color && v.color.toLowerCase() === colorName.toLowerCase()
    );
    
    if (!colorVariant || !colorVariant.id) {
      console.error(`No variant found with color ${colorName}`);
      toast.error(`Aucune variante trouvée avec la couleur ${colorName}`);
      return false;
    }
    
    const variantId = colorVariant.id;
    
    // 3. Update the variant_images object
    let currentImages: Record<string, string[]> = {};
    
    // Parse the current variant_images if it exists and is a string
    if (product.variant_images) {
      if (typeof product.variant_images === 'string') {
        try {
          currentImages = JSON.parse(product.variant_images);
        } catch (e) {
          console.error('Error parsing variant_images:', e);
          currentImages = {};
        }
      }
    }
    
    // Create a new object to avoid direct mutations
    const updatedImages: Record<string, string[]> = { ...currentImages };
    
    // Add or update the array for the specific variant
    updatedImages[variantId] = [imageUrl];
    
    // 4. Update the database - convert the object back to a string
    const { error: updateError } = await supabase
      .from('unified_products')
      .update({
        variant_images: JSON.stringify(updatedImages)
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
