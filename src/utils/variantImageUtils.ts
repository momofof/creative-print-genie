
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Télécharge une image pour une variante spécifique
 * @param file Fichier image à télécharger
 * @param productId ID du produit
 * @param variantId ID de la variante
 * @returns URL de l'image téléchargée ou null en cas d'erreur
 */
export const uploadVariantImage = async (
  file: File,
  productId: string,
  variantId: string
): Promise<string | null> => {
  try {
    if (!file) return null;

    // Générer un nom de fichier unique
    const fileExt = file.name.split('.').pop();
    const fileName = `${productId}-variant-${variantId}-${Date.now()}.${fileExt}`;
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

    return publicUrl;
  } catch (error) {
    console.error('Erreur:', error);
    toast.error('Une erreur est survenue lors du téléchargement');
    return null;
  }
};

/**
 * Met à jour les images d'une variante dans la table unified_products
 * @param productId ID du produit
 * @param variantId ID de la variante
 * @param imageUrl URL de l'image à ajouter
 * @returns true si la mise à jour a réussi, false sinon
 */
export const updateVariantImages = async (
  productId: string,
  variantId: string,
  imageUrl: string
): Promise<boolean> => {
  try {
    // Récupérer les données actuelles du produit
    const { data, error } = await supabase
      .from('unified_products')
      .select('variant_images')
      .eq('id', productId)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération des images de variante:', error);
      return false;
    }

    // Préparer le nouvel objet variant_images
    const currentImages = data.variant_images || {};
    const variantImages = currentImages[variantId] || [];
    
    // Ajouter la nouvelle URL
    const updatedImages = {
      ...currentImages,
      [variantId]: [...variantImages, imageUrl]
    };

    // Mettre à jour la table
    const { error: updateError } = await supabase
      .from('unified_products')
      .update({
        variant_images: updatedImages
      })
      .eq('id', productId);

    if (updateError) {
      console.error('Erreur lors de la mise à jour des images de variante:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur:', error);
    return false;
  }
};

/**
 * Supprime une image de variante
 * @param productId ID du produit
 * @param variantId ID de la variante
 * @param imageUrl URL de l'image à supprimer
 * @returns true si la suppression a réussi, false sinon
 */
export const removeVariantImage = async (
  productId: string,
  variantId: string,
  imageUrl: string
): Promise<boolean> => {
  try {
    // Récupérer les données actuelles du produit
    const { data, error } = await supabase
      .from('unified_products')
      .select('variant_images')
      .eq('id', productId)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération des images de variante:', error);
      return false;
    }

    // Vérifier si l'objet variant_images et le tableau d'images existent
    const currentImages = data.variant_images || {};
    if (!currentImages[variantId]) {
      return false;
    }

    // Filtrer pour retirer l'URL spécifiée
    const updatedVariantImages = currentImages[variantId].filter(
      (url: string) => url !== imageUrl
    );

    // Mettre à jour l'objet complet
    const updatedImages = {
      ...currentImages,
      [variantId]: updatedVariantImages
    };

    // Mettre à jour la table
    const { error: updateError } = await supabase
      .from('unified_products')
      .update({
        variant_images: updatedImages
      })
      .eq('id', productId);

    if (updateError) {
      console.error('Erreur lors de la mise à jour des images de variante:', updateError);
      return false;
    }

    // Optionnellement, supprimer le fichier du stockage
    // Extraire le chemin du fichier à partir de l'URL
    const filePath = imageUrl.split('/').pop();
    if (filePath) {
      const { error: storageError } = await supabase.storage
        .from('product-images')
        .remove([`variant-images/${filePath}`]);

      if (storageError) {
        console.error('Erreur lors de la suppression du fichier:', storageError);
        // Continuer même si la suppression du fichier échoue
      }
    }

    return true;
  } catch (error) {
    console.error('Erreur:', error);
    return false;
  }
};

/**
 * Récupère les images d'une variante
 * @param productId ID du produit
 * @param variantId ID de la variante
 * @returns Tableau d'URLs d'images
 */
export const getVariantImages = async (
  productId: string,
  variantId: string
): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('unified_products')
      .select('variant_images')
      .eq('id', productId)
      .single();

    if (error || !data) {
      console.error('Erreur lors de la récupération des images de variante:', error);
      return [];
    }

    // Récupérer les images de la variante spécifique
    const variantImages = data.variant_images?.[variantId] || [];
    return variantImages;
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
};
