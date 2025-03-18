
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface EmptyProductsViewProps {
  message?: string;
  buttonLabel?: string;
  buttonLink?: string;
}

const EmptyProductsView = ({
  message = "Vous n'avez pas encore de produits",
  buttonLabel = "Ajouter un produit",
  buttonLink = "/supplier/product/new"
}: EmptyProductsViewProps) => {
  return (
    <div className="text-center py-6">
      <p className="text-gray-500 mb-4">{message}</p>
      <Link to={buttonLink}>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          {buttonLabel}
        </Button>
      </Link>
    </div>
  );
};

export default EmptyProductsView;
