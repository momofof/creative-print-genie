import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Store, ArrowLeft, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGeneralInfo } from "./components/ProductFormComponents/ProductGeneralInfo";
import { ProductVariants } from "./components/ProductFormComponents/ProductVariants";
import { ProductImageUpload } from "./components/ProductFormComponents/ProductImageUpload";
import { useProductForm } from "./hooks/useProductForm";

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
    imageFile,
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
  } = useProductForm(productId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

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
              <Store className="h-5 w-5 mr-2 text-teal-600" />
              {isEditing ? "Modifier le produit" : "Ajouter un produit"}
            </h1>
          </div>
          <Button
            onClick={handleSubmit}
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
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Product Details */}
            <div className="lg:col-span-2 space-y-6">
              <ProductGeneralInfo 
                productData={productData}
                handleInputChange={handleInputChange}
                handleSelectChange={handleSelectChange}
                handleCheckboxChange={handleCheckboxChange}
              />
              
              <ProductVariants 
                variants={variants}
                addVariant={addVariant}
                removeVariant={removeVariant}
                handleVariantChange={handleVariantChange}
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
      </div>
    </div>
  );
};

export default ProductForm;
