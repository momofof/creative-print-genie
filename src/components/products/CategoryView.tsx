
import React from 'react';
import CategoryDetailView from './CategoryDetailView';
import ProductList from './ProductList';
import { Product } from '@/types/product';

interface CategoryViewProps {
  category: {
    id: string;
    title: string;
    image: string;
    subcategories: string[];
  };
  products: Product[];
  subcategoryId?: string;
}

const CategoryView = ({ category, products, subcategoryId }: CategoryViewProps) => {
  return (
    <>
      <CategoryDetailView category={category} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">{subcategoryId || category.title}</h2>
        <ProductList products={products} />
      </div>
    </>
  );
};

export default CategoryView;
