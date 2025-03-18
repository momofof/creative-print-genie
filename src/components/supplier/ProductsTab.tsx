
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ProductsTable from "./ProductsTable";
import { Product } from "@/types/dashboard";
import { Plus, FileSpreadsheet } from "lucide-react";
import CSVImportModal from "./CSVImportModal";

interface ProductsTabProps {
  products: Product[];
  onAddProduct: () => void;
  onEditProduct: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  onRefreshProducts: () => void;
}

const ProductsTab = ({ 
  products, 
  onAddProduct, 
  onEditProduct, 
  onDeleteProduct,
  onRefreshProducts
}: ProductsTabProps) => {
  const [importModalOpen, setImportModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold">Mes produits</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button 
            onClick={onAddProduct} 
            className="sm:w-auto w-full flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            <span>Ajouter un produit</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setImportModalOpen(true)}
            className="sm:w-auto w-full flex items-center justify-center gap-2"
          >
            <FileSpreadsheet size={18} />
            <span>Importer CSV</span>
          </Button>
        </div>
      </div>
      
      <ProductsTable 
        products={products}
        onEditProduct={onEditProduct}
        onDeleteProduct={onDeleteProduct}
      />

      <CSVImportModal 
        open={importModalOpen} 
        onOpenChange={setImportModalOpen} 
        onImportSuccess={onRefreshProducts}
      />
    </div>
  );
};

export default ProductsTab;
