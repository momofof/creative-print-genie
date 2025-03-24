
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Télécharge une image pour une variante spécifique et définit son URL dans le produit
 * @param file Fichier image à télécharger
 * @param productId ID du produit
 * @param variantId ID de la variante
 * @returns URL de l'image téléchargée ou null en cas d'erreur
 */
export const uploadVariantImage = async (
  file: File,
  productId: string,
  colorName: string
): Promise<string | null> => {
  try {
    if (!file) return null;

    // Générer un nom de fichier unique
    const fileExt = file.name.split('.').pop();
    const fileName = `${productId}-color-${colorName}-${Date.now()}.${fileExt}`;
    const filePath = `variant-images/${fileName}`;

    // Télécharger le fichier vers Supabase Storage
    const { error: uploadError, data } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Erreur lors du téléchargement de l\'image:', uploadError);
      toast.error('Impossible de télécharger l\'image');
      return null;
    }

    // Obtenir l'URL publique de l'image
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);
      
    // Mettre à jour le produit avec l'URL de l'image
    await updateProductWithVariantImageUrl(productId, publicUrl);

    return publicUrl;
  } catch (error) {
    console.error('Erreur:', error);
    toast.error('Une erreur est survenue lors du téléchargement');
    return null;
  }
};

/**
 * Met à jour l'URL d'image de variante dans la table unified_products
 * @param productId ID du produit
 * @param imageUrl URL de l'image
 * @returns true si la mise à jour a réussi, false sinon
 */
export const updateProductWithVariantImageUrl = async (
  productId: string,
  imageUrl: string
): Promise<boolean> => {
  try {
    // Mettre à jour directement l'URL d'image de variante
    const { error: updateError } = await supabase
      .from('unified_products')
      .update({
        variant_image_url: imageUrl
      })
      .eq('id', productId);

    if (updateError) {
      console.error('Erreur lors de la mise à jour de l\'image de variante:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur:', error);
    return false;
  }
};

/**
 * Obtient l'URL d'image de variante pour un produit
 * @param productId ID du produit
 * @returns URL de l'image ou null
 */
export const getVariantImageUrl = async (
  productId: string
): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('unified_products')
      .select('variant_image_url')
      .eq('id', productId)
      .single();

    if (error || !data) {
      console.error('Erreur lors de la récupération de l\'image de variante:', error);
      return null;
    }

    return data.variant_image_url;
  } catch (error) {
    console.error('Erreur:', error);
    return null;
  }
};
