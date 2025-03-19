
import React from 'react';
import CategoriesOverview from './CategoriesOverview';
import ProductList from './ProductList';
import { Product } from '@/types/product';

interface CatalogViewProps {
  displayedCategories: any[];
  products: Product[];
}

const CatalogView = ({ displayedCategories, products }: CatalogViewProps) => {
  return (
    <>
      <CategoriesOverview displayedCategories={displayedCategories} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Tous nos produits</h2>
        <ProductList products={products} />
      </div>
    </>
  );
};

export default CatalogView;
