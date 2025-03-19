
import React from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const ProductsLoading = () => {
  return (
    <div className="flex items-center justify-center py-20">
      <LoadingSpinner size={8} />
      <p className="ml-3 text-gray-600">Chargement des produits...</p>
    </div>
  );
};

export default ProductsLoading;
