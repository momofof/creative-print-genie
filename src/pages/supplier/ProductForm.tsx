
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Store, ArrowLeft, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGeneralInfo } from "./components/ProductFormComponents/ProductGeneralInfo";
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
    imagePreview,
    handleInputChange,
    handleSelectChange,
    handleCheckboxChange,
    handleImageChange,
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

              {/* Section for variant fields */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Détails de la variante</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="size" className="block text-sm font-medium text-gray-700">Taille</label>
                      <input
                        type="text"
                        id="size"
                        name="size"
                        value={productData.size || ""}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="color" className="block text-sm font-medium text-gray-700">Couleur</label>
                      <input
                        type="text"
                        id="color"
                        name="color"
                        value={productData.color || ""}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="hex_color" className="block text-sm font-medium text-gray-700">Code Hex Couleur</label>
                      <input
                        type="color"
                        id="hex_color"
                        name="hex_color"
                        value={productData.hex_color || "#000000"}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 h-10"
                      />
                    </div>
                    <div>
                      <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                      <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={productData.stock || 0}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="price_adjustment" className="block text-sm font-medium text-gray-700">Ajustement de prix</label>
                      <input
                        type="number"
                        id="price_adjustment"
                        name="price_adjustment"
                        value={productData.price_adjustment || 0}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="bat" className="block text-sm font-medium text-gray-700">BAT</label>
                      <input
                        type="text"
                        id="bat"
                        name="bat"
                        value={productData.bat || ""}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="poids" className="block text-sm font-medium text-gray-700">Poids</label>
                      <input
                        type="text"
                        id="poids"
                        name="poids"
                        value={productData.poids || ""}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="format" className="block text-sm font-medium text-gray-700">Format</label>
                      <input
                        type="text"
                        id="format"
                        name="format"
                        value={productData.format || ""}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="quantite" className="block text-sm font-medium text-gray-700">Quantité</label>
                      <input
                        type="text"
                        id="quantite"
                        name="quantite"
                        value={productData.quantite || ""}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="echantillon" className="block text-sm font-medium text-gray-700">Échantillon</label>
                      <input
                        type="text"
                        id="echantillon"
                        name="echantillon"
                        value={productData.echantillon || ""}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label htmlFor="types_impression" className="block text-sm font-medium text-gray-700">Types d'impression</label>
                    <input
                      type="text"
                      id="types_impression"
                      name="types_impression"
                      value={productData.types_impression || ""}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="type_de_materiaux" className="block text-sm font-medium text-gray-700">Type de matériaux</label>
                    <input
                      type="text"
                      id="type_de_materiaux"
                      name="type_de_materiaux"
                      value={productData.type_de_materiaux || ""}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="details_impression" className="block text-sm font-medium text-gray-700">Détails d'impression</label>
                    <input
                      type="text"
                      id="details_impression"
                      name="details_impression"
                      value={productData.details_impression || ""}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="orientation_impression" className="block text-sm font-medium text-gray-700">Orientation d'impression</label>
                    <input
                      type="text"
                      id="orientation_impression"
                      name="orientation_impression"
                      value={productData.orientation_impression || ""}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>
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
