
import { DatabaseProduct, ProductStatus } from "@/types/product";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import LoadingSpinner from "@/components/profile/LoadingSpinner";
import ProductCard from "./ProductCard";

interface ProductsGridProps {
  products: DatabaseProduct[];
  loading: boolean;
  onRefresh: () => Promise<void>;
  onStatusChange: (productId: string, newStatus: ProductStatus) => Promise<void>;
}

const ProductsGrid = ({ products, loading, onRefresh, onStatusChange }: ProductsGridProps) => {
  const navigate = useNavigate();

  if (loading) {
    return <div className="flex justify-center p-12"><LoadingSpinner /></div>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Aucun produit trouvé</h3>
        <p className="mt-1 text-sm text-gray-500">
          Commencez par ajouter votre premier produit imprimable
        </p>
        <div className="mt-6">
          <Button onClick={() => navigate("/supplier/product/new")}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter un produit
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};

export default ProductsGrid;
