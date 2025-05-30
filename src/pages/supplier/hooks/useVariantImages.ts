
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { VariantImage } from "@/types/dashboard";
import { 
  updateVariantImages, 
  removeVariantImage, 
  getProductVariantImages 
} from "@/utils/variantImageUtils";

export const useVariantImages = (productId: string) => {
  const [variantImagePreviews, setVariantImagePreviews] = useState<Record<string, string[]>>({});
  const [isUploading, setIsUploading] = useState(false);

  // Charger les images existantes
  const loadVariantImages = async () => {
    try {
      if (!productId) return;

      // Récupérer les images des variantes
      const imagesByVariant = await getProductVariantImages(productId);
      
      // Convertir les objets VariantImage en URLs
      const imagePreviewsByVariant: Record<string, string[]> = {};
      
      Object.entries(imagesByVariant).forEach(([variantId, images]) => {
        imagePreviewsByVariant[variantId] = images.map(img => img.image_url);
      });
      
      setVariantImagePreviews(imagePreviewsByVariant);
    } catch (error) {
      console.error("Erreur lors du chargement des images de variantes:", error);
    }
  };

  // Gérer le téléchargement d'une nouvelle image
  const handleVariantImageUpload = async (
    variantId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      if (!e.target.files || e.target.files.length === 0 || !productId) {
        return;
      }

      setIsUploading(true);
      const file = e.target.files[0];
      
      // Générer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}-variant-${variantId}-${Date.now()}.${fileExt}`;
      const filePath = `variant-images/${fileName}`;

      // Télécharger l'image vers Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Erreur lors du téléchargement de l'image:", uploadError);
        toast.error("Impossible de télécharger l'image");
        setIsUploading(false);
        return;
      }

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      // Mettre à jour la table variant_images
      const success = await updateVariantImages(productId, variantId, publicUrl);
      
      if (success) {
        // Mettre à jour l'état local
        setVariantImagePreviews(prev => {
          const currentImages = prev[variantId] || [];
          return {
            ...prev,
            [variantId]: [...currentImages, publicUrl]
          };
        });
        
        toast.success("Image ajoutée avec succès");
      } else {
        toast.error("Impossible de mettre à jour les images de variante");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsUploading(false);
    }
  };

  // Supprimer une image
  const handleVariantImageDelete = async (variantId: string, imageUrl: string) => {
    try {
      if (!productId) return;
      
      const success = await removeVariantImage(productId, variantId, imageUrl);
      
      if (success) {
        // Mettre à jour l'état local
        setVariantImagePreviews(prev => {
          const currentImages = prev[variantId] || [];
          return {
            ...prev,
            [variantId]: currentImages.filter(url => url !== imageUrl)
          };
        });
        
        toast.success("Image supprimée avec succès");
      } else {
        toast.error("Impossible de supprimer l'image");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue");
    }
  };

  return {
    variantImagePreviews,
    isUploading,
    loadVariantImages,
    handleVariantImageUpload,
    handleVariantImageDelete
  };
};
