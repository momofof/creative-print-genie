
import React from "react";
import { FileText } from "lucide-react";
import { Product } from "@/types/product";

interface ProductDescriptionProps {
  product: Product | undefined;
}

const ProductDescription = ({ product }: ProductDescriptionProps) => {
  if (!product || !product.description) return null;

  // Limite la description à un certain nombre de caractères avec un bouton "Voir plus" si nécessaire
  const maxLength = 200;
  const shouldTruncate = product.description.length > maxLength;
  const truncatedDescription = shouldTruncate 
    ? `${product.description.substring(0, maxLength)}...` 
    : product.description;

  return (
    <div className="mt-2 bg-gray-50 p-3 rounded-md">
      <div className="flex items-start gap-2">
        <FileText className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-sm mb-1">Description du produit</h4>
          <p className="text-sm text-gray-600">
            {truncatedDescription}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;
