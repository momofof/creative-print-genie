
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const EmptyProductsView = () => {
  return (
    <div className="text-center py-6">
      <p className="text-gray-500 mb-4">Vous n'avez pas encore de produits</p>
      <Link to="/supplier/product/new">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un produit
        </Button>
      </Link>
    </div>
  );
};

export default EmptyProductsView;
