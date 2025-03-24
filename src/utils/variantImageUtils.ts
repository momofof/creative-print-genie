
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { VariantImage } from "@/types/dashboard";

// Ajouter une nouvelle image à une variante
export const addVariantImage = async (
  productId: string,
  variantId: string,
  imageUrl: string
): Promise<boolean> => {
  try {
    if (!productId || !variantId || !imageUrl) {
      toast.error("Paramètres manquants pour ajouter l'image");
      return false;
    }

    // Insérer directement dans la table variant_images
    const { error } = await supabase
      .from('variant_images')
      .insert({
        product_id: productId,
        variant_id: variantId,
        image_url: imageUrl
      });

    if (error) {
      console.error("Erreur lors de l'ajout de l'image:", error);
      toast.error("Impossible d'ajouter l'image");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur:", error);
    toast.error("Une erreur est survenue");
    return false;
  }
};

// Récupérer toutes les images d'une variante
export const getVariantImages = async (
  variantId: string
): Promise<VariantImage[]> => {
  try {
    const { data, error } = await supabase
      .from('variant_images')
      .select('*')
      .eq('variant_id', variantId);

    if (error) {
      console.error("Erreur lors de la récupération des images:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Erreur:", error);
    return [];
  }
};

// Récupérer toutes les images des variantes d'un produit
export const getProductVariantImages = async (
  productId: string
): Promise<Record<string, VariantImage[]>> => {
  try {
    const { data, error } = await supabase
      .from('variant_images')
      .select('*')
      .eq('product_id', productId);

    if (error) {
      console.error("Erreur lors de la récupération des images:", error);
      return {};
    }

    // Organiser les images par variante
    const imagesByVariant: Record<string, VariantImage[]> = {};
    
    if (data) {
      data.forEach((image: VariantImage) => {
        if (!imagesByVariant[image.variant_id]) {
          imagesByVariant[image.variant_id] = [];
        }
        imagesByVariant[image.variant_id].push(image);
      });
    }

    return imagesByVariant;
  } catch (error) {
    console.error("Erreur:", error);
    return {};
  }
};

// Mettre à jour les images d'une variante
export const updateVariantImages = async (
  productId: string,
  variantId: string,
  imageUrl: string
): Promise<boolean> => {
  try {
    return await addVariantImage(productId, variantId, imageUrl);
  } catch (error) {
    console.error("Erreur:", error);
    toast.error("Une erreur est survenue");
    return false;
  }
};

// Supprimer une image de variante
export const removeVariantImage = async (
  productId: string,
  variantId: string,
  imageUrl: string
): Promise<boolean> => {
  try {
    // Récupérer l'ID de l'image
    const { data, error: fetchError } = await supabase
      .from('variant_images')
      .select('id')
      .eq('product_id', productId)
      .eq('variant_id', variantId)
      .eq('image_url', imageUrl)
      .single();

    if (fetchError || !data) {
      console.error("Erreur lors de la récupération de l'image:", fetchError);
      toast.error("Impossible de trouver l'image");
      return false;
    }

    // Supprimer l'image
    const { error: deleteError } = await supabase
      .from('variant_images')
      .delete()
      .eq('id', data.id);

    if (deleteError) {
      console.error("Erreur lors de la suppression de l'image:", deleteError);
      toast.error("Impossible de supprimer l'image");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur:", error);
    toast.error("Une erreur est survenue");
    return false;
  }
};
