
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UploadOptions {
  bucketName: string;
  folderPath: string;
  fileName: string;
  file: File;
}

/**
 * Upload a file to Supabase Storage
 */
export const uploadFile = async ({
  bucketName,
  folderPath,
  fileName,
  file
}: UploadOptions): Promise<string | null> => {
  try {
    // Generate a unique file path
    const filePath = `${folderPath}/${fileName}`;
    
    // Upload the file
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase
      .storage
      .from(bucketName)
      .getPublicUrl(data.path);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadFile:', error);
    return null;
  }
};

/**
 * Update variant image URL for a product
 */
export const updateProductVariantImage = async (
  productId: string,
  imageUrl: string
): Promise<boolean> => {
  try {
    // Update the product with the variant image URL
    const { error } = await supabase
      .from('products_complete')
      .update({ variant_image_url: imageUrl })
      .eq('id', productId);
    
    if (error) {
      console.error('Error updating product variant image:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateProductVariantImage:', error);
    return false;
  }
};

/**
 * Fetch product variant image URL
 */
export const getProductVariantImage = async (productId: string): Promise<string | null> => {
  try {
    // Fetch the product with the variant image URL
    const { data, error } = await supabase
      .from('products_complete')
      .select('variant_image_url')
      .eq('id', productId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching product variant image:', error);
      return null;
    }
    
    if (!data || !data.variant_image_url) {
      return null;
    }
    
    return data.variant_image_url;
  } catch (error) {
    console.error('Error in getProductVariantImage:', error);
    return null;
  }
};
