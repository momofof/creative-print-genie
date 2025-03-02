
import React from 'react';
import { Button } from "@/components/ui/button";

interface ProductFormSubmitProps {
  isLoading: boolean;
  isEditMode: boolean;
}

const ProductFormSubmit: React.FC<ProductFormSubmitProps> = ({
  isLoading,
  isEditMode
}) => {
  return (
    <Button disabled={isLoading} className="w-full">
      {isLoading ? 'Enregistrement...' : (isEditMode ? 'Mettre à jour le produit' : 'Ajouter le produit')}
    </Button>
  );
};

export default ProductFormSubmit;
