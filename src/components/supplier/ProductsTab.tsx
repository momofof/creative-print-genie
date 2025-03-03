
import React from "react";
import { Button } from "@/components/ui/button";
import ProductsTable from "./ProductsTable";
import { Product } from "@/types/dashboard";
import { Plus } from "lucide-react";

interface ProductsTabProps {
  products: Product[];
  onAddProduct: () => void;
  onEditProduct: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
}

const ProductsTab = ({ products, onAddProduct, onEditProduct, onDeleteProduct }: ProductsTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold">Mes produits</h2>
        <Button onClick={onAddProduct} className="sm:w-auto w-full flex items-center justify-center gap-2">
          <Plus size={18} />
          <span>Ajouter un produit</span>
        </Button>
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
