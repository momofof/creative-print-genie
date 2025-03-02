
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductActionsProps {
  // Add any props needed for customization
  productId?: string;
}

const ProductActions = ({ productId }: ProductActionsProps) => {
  return (
    <div className="flex flex-col space-y-3 mb-6">
      <Button className="w-full py-6 text-base font-medium flex items-center gap-2 bg-accent hover:bg-accent/90">
        <ShoppingCart className="w-5 h-5" />
        Ajouter au panier
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full py-6 text-base font-medium flex items-center justify-center gap-2"
      >
        <Heart className="w-5 h-5" />
        Ajouter aux favoris
      </Button>
      
      <Link to={`/customize/${productId || ''}`}>
        <Button 
          className="w-full py-6 text-base font-medium bg-teal-600 hover:bg-teal-700"
        >
          Personnaliser
        </Button>
      </Link>
    </div>
  );
};

export default ProductActions;
