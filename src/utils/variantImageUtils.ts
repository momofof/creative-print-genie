
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { VariantImage } from "@/types/dashboard";

// Récupérer les images des variantes d'un produit
export const getProductVariantImages = async (productId: string): Promise<Record<string, VariantImage[]>> => {
  try {
    // Récupérer toutes les images de variantes pour ce produit
    const { data, error } = await supabase
      .from('variant_images')
      .select('*')
      .eq('product_id', productId);
    
    if (error) {
      console.error("Erreur lors de la récupération des images de variantes:", error);
      return {};
    }
    
    // Organiser les images par variante
    const imagesByVariant: Record<string, VariantImage[]> = {};
    
    (data as VariantImage[]).forEach((img) => {
      if (img.variant_id) {
        if (!imagesByVariant[img.variant_id]) {
          imagesByVariant[img.variant_id] = [];
        }
        imagesByVariant[img.variant_id].push(img);
      }
    });
    
    return imagesByVariant;
  } catch (error) {
    console.error("Erreur:", error);
    return {};
  }
};

// Ajouter ou mettre à jour les images d'une variante
export const updateVariantImages = async (
  productId: string,
  variantId: string,
  imageUrl: string
): Promise<boolean> => {
  try {
    // Ajouter l'image à la variante
    const { error } = await supabase
      .from('variant_images')
      .insert({
        product_id: productId,
        variant_id: variantId,
        image_url: imageUrl
      });
    
    if (error) {
      console.error("Erreur lors de l'ajout de l'image à la variante:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Erreur:", error);
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
    // Supprimer l'image de la base de données
    const { error } = await supabase
      .from('variant_images')
      .delete()
      .match({
        product_id: productId,
        variant_id: variantId,
        image_url: imageUrl
      });
    
    if (error) {
      console.error("Erreur lors de la suppression de l'image de la variante:", error);
      return false;
    }
    
    // Supprimer le fichier du stockage
    const filePath = imageUrl.split('/').pop();
    if (filePath) {
      const { error: storageError } = await supabase.storage
        .from('product-images')
        .remove([`variant-images/${filePath}`]);
      
      if (storageError) {
        console.error("Erreur lors de la suppression du fichier:", storageError);
        toast.error("L'image a été supprimée de la base de données mais pas du stockage");
      }
    }
    
    return true;
  } catch (error) {
    console.error("Erreur:", error);
    return false;
  }
};
