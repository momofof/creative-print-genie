
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ProductEmptyState = () => {
  return (
    <div className="text-center py-12">
      <p className="text-lg text-gray-600">Aucun produit trouvé dans cette catégorie.</p>
      <Link to="/products">
        <Button variant="outline" className="mt-4">Voir toutes les catégories</Button>
      </Link>
    </div>
  );
};

export default ProductEmptyState;
