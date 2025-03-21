
import { useProductData } from "./useProductData";
import { useProductFormHandlers } from "./useProductFormHandlers";

export const useProductForm = (productId?: string) => {
  const {
    productData,
    variants,
    imageFile,
    imagePreview,
    isLoading,
    isSaving,
    setState,
    isEditing
  } = useProductData(productId);
  
  const {
    handleInputChange,
    handleSelectChange,
    handleCheckboxChange,
    handleImageChange,
    addVariant,
    removeVariant,
    handleVariantChange,
    handleSubmit
  } = useProductFormHandlers({
    state: {
      productData,
      variants,
      imageFile,
      imagePreview,
      isLoading,
      isSaving
    },
    setState,
    productId
  });

  return {
    isLoading,
    isSaving,
    productData,
    variants,
    imageFile,
    imagePreview,
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
