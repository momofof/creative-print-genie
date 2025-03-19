
import { supabase } from "@/integrations/supabase/client";
import { ProductData, ProductVariant } from "./types";
import { getCurrentUser } from "./authUtils";
import { uploadProductImage } from "./imageUtils";
import { toJsonValue } from "@/utils/jsonUtils";

export const saveProduct = async (
  productData: ProductData,
  variants: ProductVariant[],
  imageFile: File | null,
  isEditing: boolean,
  productId?: string
): Promise<void> => {
  try {
    const user = await getCurrentUser();
    
    // 1. Upload image if there's a new one
    const imageUrl = await uploadProductImage(imageFile, productData.image);
    
    // 2. Filter out deleted variants
    const activeVariants = variants.filter(variant => !variant.isDeleted);
    
    // 3. Create or update product in products_master table
    const productPayload = {
      ...productData,
      supplier_id: user.id,
      image: imageUrl || productData.image,
      variants: toJsonValue(activeVariants) // Convert to Json compatible format
    };
    
    if (isEditing && productId) {
      // Update existing product
      const { error: updateError } = await supabase
        .from("products_master")
        .update(productPayload)
        .eq("id", productId);
      
      if (updateError) throw updateError;
    } else {
      // Create new product
      const { error: createError } = await supabase
        .from("products_master")
        .insert(productPayload);
      
      if (createError) throw createError;
    }
  } catch (error: any) {
    console.error("Error saving product:", error);
    throw error;
  }
};
