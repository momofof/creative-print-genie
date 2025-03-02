
import React from 'react';
import Navigation from '@/components/Navigation';
import { useProductForm } from '@/components/supplier/useProductForm';
import ProductBasicInfo from '@/components/supplier/ProductBasicInfo';
import ProductImageUpload from '@/components/supplier/ProductImageUpload';
import ProductDescription from '@/components/supplier/ProductDescription';
import ProductCustomizableToggle from '@/components/supplier/ProductCustomizableToggle';
import ProductFormSubmit from '@/components/supplier/ProductFormSubmit';

const ProductForm = () => {
  const {
    name,
    setName,
    price,
    setPrice,
    originalPrice,
    setOriginalPrice,
    image,
    category,
    setCategory,
    subcategory,
    setSubcategory,
    description,
    setDescription,
    isCustomizable,
    setIsCustomizable,
    status,
    setStatus,
    isLoading,
    isEditMode,
    handleSubmit,
    handleImageChange
  } = useProductForm();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <Navigation />
      <div className="container py-16 px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">{isEditMode ? 'Modifier le produit' : 'Ajouter un produit'}</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <ProductBasicInfo
              name={name}
              setName={setName}
              price={price}
              setPrice={setPrice}
              originalPrice={originalPrice}
              setOriginalPrice={setOriginalPrice}
              category={category}
              setCategory={setCategory}
              subcategory={subcategory}
              setSubcategory={setSubcategory}
              status={status}
              setStatus={setStatus}
            />

            <ProductImageUpload
              image={image}
              handleImageChange={handleImageChange}
            />

            <ProductDescription
              description={description}
              setDescription={setDescription}
            />

            <ProductCustomizableToggle
              isCustomizable={isCustomizable}
              setIsCustomizable={setIsCustomizable}
            />

            <ProductFormSubmit
              isLoading={isLoading}
              isEditMode={isEditMode}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
