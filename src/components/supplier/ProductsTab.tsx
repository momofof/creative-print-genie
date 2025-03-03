
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ProductsTable from "./ProductsTable";
import ProductFormModal from "./ProductFormModal";
import { Product } from "@/types/dashboard";

interface ProductsTabProps {
  products: Product[];
  onAddProduct: () => void;
  onEditProduct: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  onProductSaved: () => void;
}

const ProductsTab = ({ products, onAddProduct, onEditProduct, onDeleteProduct, onProductSaved }: ProductsTabProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(undefined);

  const handleAddProductClick = () => {
    setSelectedProductId(undefined);
    setIsFormOpen(true);
  };

  const handleEditProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedProductId(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Mes produits</h2>
        <Button onClick={handleAddProductClick}>Ajouter un produit</Button>
      </div>
      
      <ProductsTable 
        products={products}
        onEditProduct={handleEditProductClick}
        onDeleteProduct={onDeleteProduct}
      />

      <ProductFormModal 
        isOpen={isFormOpen}
        onClose={handleFormClose}
        productId={selectedProductId}
        onProductSaved={onProductSaved}
      />
    </div>
  );
};

export default ProductsTab;
