
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

export const useImageUpload = (imageFile: File | null, productName: string) => {
  const uploadProductImage = async (): Promise<string | null> => {
    if (!imageFile) return null;
    
    try {
      // Create a unique file name to avoid collisions
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;
      
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, imageFile);
      
      if (uploadError) throw uploadError;
      
      // Get the public URL for the uploaded image
      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };
  
  return { uploadProductImage };
};
