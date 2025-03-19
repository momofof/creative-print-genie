
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface AddToCartButtonProps {
  onClick: () => Promise<void> | void;
  isLoading: boolean;
}

const AddToCartButton = ({ onClick, isLoading }: AddToCartButtonProps) => {
  return (
    <Button 
      className="w-full py-6 text-base font-medium flex items-center gap-2 bg-accent hover:bg-accent/90"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <LoadingSpinner className="text-white" />
          Ajout en cours...
        </span>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          Ajouter au panier
        </>
      )}
    </Button>
  );
};

export default AddToCartButton;
