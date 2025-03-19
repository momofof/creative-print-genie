
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { toJsonValue } from "@/utils/jsonUtils";
import { ProductData, ProductVariant } from "./types";

export const useProductSubmit = () => {
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (
    e: React.FormEvent,
    productId: string | undefined,
    productData: ProductData,
    variants: ProductVariant[],
    uploadImage: () => Promise<string | null>
  ) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        toast.error("Utilisateur non authentifié");
        navigate("/login");
        return;
      }
      
      // 1. Upload image if there's a new one
      const imageUrl = await uploadImage();
      
      // 2. Filter out deleted variants
      const activeVariants = variants.filter(variant => !variant.isDeleted);
      
      // 3. Create or update product in products_master table
      const productPayload = {
        ...productData,
        supplier_id: userData.user.id,
        image: imageUrl || productData.image,
        variants: toJsonValue(activeVariants) // Convert to Json compatible format
      };
      
      if (productId) {
        // Update existing product
        const { error: updateError } = await supabase
          .from("products_master")
          .update(productPayload)
          .eq("id", productId);
        
        if (updateError) throw updateError;
        toast.success("Produit mis à jour avec succès");
      } else {
        // Create new product
        const { error: createError } = await supabase
          .from("products_master")
          .insert(productPayload);
        
        if (createError) throw createError;
        toast.success("Produit créé avec succès");
      }
      
      navigate("/supplier/dashboard");
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast.error(error.message || "Erreur lors de l'enregistrement du produit");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    handleSubmit
  };
};
