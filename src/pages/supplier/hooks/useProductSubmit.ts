
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { toJsonValue } from "@/utils/jsonUtils";
import { useImageUpload } from "./useImageUpload";
import { ProductData, ProductVariant } from "./types/productTypes";

export const useProductSubmit = (
  isEditing: boolean,
  productId: string | undefined,
  productData: ProductData,
  variants: ProductVariant[],
  imageFile: File | null,
  variantImageFiles: Record<string, File>,
  variantImagePreviews: Record<string, string>
) => {
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  
  const { uploadProductImage, uploadVariantImages } = useImageUpload(
    imageFile, 
    productData, 
    variantImageFiles, 
    variantImagePreviews,
    variants
  );

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        toast.error("Utilisateur non authentifié");
        navigate("/login");
        return;
      }
      
      // 1. Upload main product image if there's a new one
      const imageUrl = await uploadProductImage();
      
      // 2. Upload variant images
      const variantImagesUrls = await uploadVariantImages();
      
      // 3. Filter out deleted variants and update variant images
      const activeVariants = variants
        .filter(variant => !variant.isDeleted)
        .map(variant => ({
          ...variant,
          image: variant.id && variantImagesUrls[variant.id] ? variantImagesUrls[variant.id] : null
        }));
      
      // 4. Create or update product in products_master table
      const productPayload = {
        ...productData,
        supplier_id: userData.user.id,
        image: imageUrl || productData.image,
        variant_images: toJsonValue(variantImagesUrls), // Store variant images mapping
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
        // Get the highest current product ID to generate the next sequential ID
        const { data: lastProduct, error: countError } = await supabase
          .from('products_master')
          .select('id')
          .order('id', { ascending: false })
          .limit(1);
        
        let nextId = 1;
        if (!countError && lastProduct && lastProduct.length > 0) {
          const highestId = parseInt(lastProduct[0].id);
          if (!isNaN(highestId)) {
            nextId = highestId + 1;
          }
        }
        
        // Create new product with sequential ID
        const { error: createError } = await supabase
          .from("products_master")
          .insert({
            ...productPayload,
            id: nextId.toString()
          });
        
        if (createError) throw createError;
      }
      
      toast.success(isEditing ? "Produit mis à jour avec succès" : "Produit créé avec succès");
      navigate("/supplier/dashboard");
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast.error(error.message || "Erreur lors de l'enregistrement du produit");
    } finally {
      setIsSaving(false);
    }
  };

  return { isSaving, handleSubmit };
};
