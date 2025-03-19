
import { supabase } from "@/integrations/supabase/client";

export const uploadProductImage = async (
  imageFile: File | null, 
  currentImageUrl: string | null
): Promise<string | null> => {
  if (!imageFile) return currentImageUrl;
  
  try {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, imageFile);
    
    if (uploadError) throw uploadError;
    
    const { data: urlData } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
