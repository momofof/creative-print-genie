
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProductVariant } from "./types/productTypes";

export const useImageUpload = (
  imageFile: File | null,
  productData: any,
  variantImageFiles: Record<string, File>,
  variantImagePreviews: Record<string, string>,
  variants: ProductVariant[]
) => {
  const uploadProductImage = async (): Promise<string | null> => {
    if (!imageFile) return productData.image;
    
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile);
      
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Erreur lors de l'upload de l'image");
      return null;
    }
  };

  const uploadVariantImages = async (): Promise<Record<string, string>> => {
    const variantImages: Record<string, string> = { ...variantImagePreviews };
    
    // Filter out variant image previews for deleted variants
    const deletedVariantIds = variants
      .filter(v => v.isDeleted)
      .map(v => v.id)
      .filter((id): id is string => id !== undefined);
    
    deletedVariantIds.forEach(id => {
      delete variantImages[id];
    });
    
    // Upload new variant images
    for (const [variantId, file] of Object.entries(variantImageFiles)) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `variant-${variantId}-${crypto.randomUUID()}.${fileExt}`;
        const filePath = `product-images/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
        
        variantImages[variantId] = urlData.publicUrl;
      } catch (error) {
        console.error(`Error uploading variant image for ${variantId}:`, error);
        toast.error(`Erreur lors de l'upload de l'image pour une variante`);
      }
    }
    
    return variantImages;
  };

  return { uploadProductImage, uploadVariantImages };
};
