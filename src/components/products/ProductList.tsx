
import React from "react";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";

interface ProductListProps {
  products: Product[];
  showVariants?: boolean;
}

const ProductList = ({ products, showVariants = false }: ProductListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            showVariants={showVariants}
          />
        ))
      ) : (
        <div className="col-span-full text-center py-10">
          <p className="text-gray-500">Aucun produit trouvé</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
