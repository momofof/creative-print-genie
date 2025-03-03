
import React from "react";
import { Button } from "@/components/ui/button";
import ProductsTable from "./ProductsTable";
import { Product } from "@/types/dashboard";

interface ProductsTabProps {
  products: Product[];
  onAddProduct: () => void;
  onEditProduct: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
}

const ProductsTab = ({ products, onAddProduct, onEditProduct, onDeleteProduct }: ProductsTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Mes produits</h2>
        <Button onClick={onAddProduct}>Ajouter un produit</Button>
      </div>
      
      <ProductsTable 
        products={products}
        onEditProduct={onEditProduct}
        onDeleteProduct={onDeleteProduct}
      />
    </div>
  );
};

export default ProductsTab;
