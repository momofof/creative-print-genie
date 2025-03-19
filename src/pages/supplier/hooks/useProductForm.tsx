
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { toJsonValue } from "@/utils/jsonUtils";
import { useProductFormData, ProductData } from "./useProductFormData";
import { useProductVariants, ProductVariant } from "./useProductVariants";
import { useProductImage } from "./useProductImage";
import { useProductData } from "./useProductData";

export type { ProductData, ProductVariant };

export const useProductForm = (productId?: string) => {
  const navigate = useNavigate();
  const isEditing = !!productId;
  const [isSaving, setIsSaving] = useState(false);
  
  // Use our smaller, focused hooks
  const { productData, setProductData, handleInputChange, handleSelectChange, handleCheckboxChange } = useProductFormData();
  const { variants, addVariant, removeVariant, handleVariantChange, setVariants, parseVariantsFromJson } = useProductVariants();
  const { imageFile, imagePreview, setImageFile, setImagePreview, handleImageChange, uploadProductImage } = useProductImage();
  const { isLoading, setIsLoading, checkAuthentication, fetchProductData } = useProductData(productId);
  
  // Initialize the form
  useEffect(() => {
    const initializeForm = async () => {
      // Verify user is authenticated
      const isAuthenticated = await checkAuthentication();
      if (!isAuthenticated) return;
      
      if (isEditing && productId) {
        try {
          await fetchProductData(productId, setProductData, setImagePreview);
        } catch (error) {
          console.error("Error initializing form:", error);
        }
      }
      
      setIsLoading(false);
    };
    
    initializeForm();
  }, [productId]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
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
      const imageUrl = await uploadProductImage();
      
      // 2. Filter out deleted variants
      const activeVariants = variants.filter(variant => !variant.isDeleted);
      
      // 3. Create or update product in products_master table
      const productPayload = {
        ...productData,
        supplier_id: userData.user.id,
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
    isLoading,
    isSaving,
    productData,
    variants,
    imageFile,
    imagePreview,
    setImageFile,
    setImagePreview,
    handleInputChange,
    handleSelectChange,
    handleCheckboxChange,
    handleImageChange,
    addVariant,
    removeVariant,
    handleVariantChange,
    handleSubmit
  };
};
