
import { useEffect } from "react";
import { useProductAuth } from "./useProductAuth";
import { useProductData } from "./useProductData";
import { useProductImage } from "./useProductImage";
import { useProductVariants } from "./useProductVariants";
import { useProductSubmit } from "./useProductSubmit";
import { useProductInputs } from "./useProductInputs";
import { ProductData, ProductVariant } from "./types";

export { ProductData, ProductVariant } from "./types";

export const useProductForm = (productId?: string) => {
  const { checkAuthentication } = useProductAuth();
  
  const {
    isLoading,
    setIsLoading,
    productData: initialProductData,
    variants: initialVariants,
    isEditing,
    fetchProductData
  } = useProductData(productId);
  
  const {
    imageFile,
    imagePreview,
    setImageFile,
    setImagePreview,
    handleImageChange,
    uploadProductImage
  } = useProductImage(initialProductData.image);
  
  const {
    productData,
    handleInputChange,
    handleSelectChange,
    handleCheckboxChange
  } = useProductInputs(initialProductData);
  
  const {
    variants,
    addVariant,
    removeVariant,
    handleVariantChange
  } = useProductVariants(initialVariants);
  
  const { isSaving, handleSubmit: submitProduct } = useProductSubmit();

  useEffect(() => {
    checkAuthentication();
    if (isEditing) {
      fetchProductData().then(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [productId]);

  // Update imagePreview when productData.image changes
  useEffect(() => {
    if (initialProductData.image && !imagePreview) {
      setImagePreview(initialProductData.image);
    }
  }, [initialProductData.image]);

  const handleSubmit = (e: React.FormEvent) => {
    submitProduct(
      e,
      productId,
      productData,
      variants,
      () => uploadProductImage(productData.image)
    );
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
