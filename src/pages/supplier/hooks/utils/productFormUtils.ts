
import { ProductVariant } from "../types/productTypes";
import { supabase } from "@/integrations/supabase/client";

export const parseVariantsFromJson = (jsonVariants: any): ProductVariant[] => {
  if (!jsonVariants) return [];
  
  if (Array.isArray(jsonVariants)) {
    return jsonVariants as ProductVariant[];
  } else if (typeof jsonVariants === 'object') {
    return Object.values(jsonVariants) as ProductVariant[];
  }
  
  try {
    if (typeof jsonVariants === 'string') {
      const parsed = JSON.parse(jsonVariants);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return Object.values(parsed);
    }
  } catch (e) {
    console.error("Error parsing variants JSON:", e);
  }
  
  return [];
};

export const uploadProductImage = async (imageFile: File | null, currentImageUrl: string | null): Promise<string | null> => {
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
    return null;
  }
};

export const getNextProductId = async (): Promise<number> => {
  const { data: lastProduct, error } = await supabase
    .from('products_master')
    .select('id')
    .order('id', { ascending: false })
    .limit(1);
    
  let nextId = 1;
  if (!error && lastProduct && lastProduct.length > 0) {
    const highestId = parseInt(lastProduct[0].id);
    if (!isNaN(highestId)) {
      nextId = highestId + 1;
    }
  }
  
  return nextId;
};
