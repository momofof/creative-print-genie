
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Save, PackageOpen, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGeneralInfo } from "./components/ProductFormComponents/ProductGeneralInfo";
import { ProductVariants } from "./components/ProductFormComponents/ProductVariants";
import { ProductImageUpload } from "./components/ProductFormComponents/ProductImageUpload";
import { useProductForm } from "./hooks/useProductForm";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productFormWithVariantsSchema, ProductFormValues } from "./schema/productFormSchema";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ProductForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isEditing = !!productId;
  
  const {
    isLoading,
    isSaving,
    productData,
    variants,
    imagePreview,
    handleInputChange,
    handleSelectChange,
    handleCheckboxChange,
    handleImageChange,
    addVariant,
    removeVariant,
    handleVariantChange,
    handleSubmit: submitProductForm,
    setProductData
  } = useProductForm(productId);

  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productFormWithVariantsSchema),
    defaultValues: {
      name: "",
      price: 0,
      original_price: null,
      category: "",
      subcategory: null,
      description: null,
      image: null,
      status: "draft",
      is_customizable: false,
      variants: []
    },
    mode: "onBlur"
  });

  const { handleSubmit, formState, reset, setValue, watch } = methods;
  const { errors, isDirty } = formState;

  // Update form values when product data is loaded
  useEffect(() => {
    if (productData) {
      Object.entries(productData).forEach(([key, value]) => {
        // @ts-ignore - setValue accepts dynamic keys
        setValue(key, value);
      });
    }
  }, [productData, setValue]);

  // Update form values when variants change
  useEffect(() => {
    setValue('variants', variants);
  }, [variants, setValue]);

  // Handle form submission
  const onSubmit = () => {
    submitProductForm(new Event('submit') as unknown as React.FormEvent);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  // Check if there are any validation errors
  const hasFormErrors = Object.keys(errors).length > 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/supplier/dashboard')}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour
            </Button>
            <h1 className="text-xl font-semibold text-gray-900 flex items-center">
              <PackageOpen className="h-5 w-5 mr-2 text-teal-600" />
              {isEditing ? "Modifier le produit" : "Ajouter un produit"}
            </h1>
          </div>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            {isSaving ? (
              <span className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Enregistrement...
              </span>
            ) : (
              <span className="flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </span>
            )}
          </Button>
        </div>
      </div>
      
      {/* Form content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {hasFormErrors && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Veuillez corriger les erreurs dans le formulaire avant de soumettre.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Product Details */}
              <div className="lg:col-span-2 space-y-6">
                <ProductGeneralInfo 
                  productData={productData}
                  handleInputChange={handleInputChange}
                  handleSelectChange={handleSelectChange}
                  handleCheckboxChange={handleCheckboxChange}
                  errors={errors}
                />
                
                <ProductVariants 
                  variants={variants}
                  addVariant={addVariant}
                  removeVariant={removeVariant}
                  handleVariantChange={handleVariantChange}
                  errors={errors.variants}
                />
              </div>
              
              {/* Right Column - Image Upload */}
              <div className="lg:col-span-1">
                <ProductImageUpload 
                  imagePreview={imagePreview}
                  handleImageChange={handleImageChange}
                />
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default ProductForm;
