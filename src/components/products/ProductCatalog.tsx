
import React from "react";
import { productCategories } from "@/data";
import CatalogHeader from "./CatalogHeader";
import CategoryGrid from "./CategoryGrid";

const ProductCatalog: React.FC = () => {
  return (
    <div className="bg-white">
      <CatalogHeader />
      <CategoryGrid categories={productCategories} />
    </div>
  );
};

export default ProductCatalog;
