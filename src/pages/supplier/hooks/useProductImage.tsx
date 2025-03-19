
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useProductImage = (initialImageUrl: string | null = null) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialImageUrl);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProductImage = async (): Promise<string | null> => {
    if (!imageFile) return imagePreview;
    
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
      toast.error("Erreur lors de l'upload de l'image");
      return null;
    }
  };

  return {
    imageFile,
    imagePreview,
    setImageFile,
    setImagePreview,
    handleImageChange,
    uploadProductImage
  };
};
