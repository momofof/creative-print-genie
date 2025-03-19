
import React from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface AddToFavoritesButtonProps {
  onClick: () => Promise<void> | void;
  isLoading?: boolean;
}

const AddToFavoritesButton = ({ 
  onClick,
  isLoading = false
}: AddToFavoritesButtonProps) => {
  return (
    <Button 
      variant="outline" 
      className="w-full py-6 text-base font-medium flex items-center justify-center gap-2"
      onClick={onClick}
      disabled={isLoading}
    >
      <Heart className="w-5 h-5" />
      Ajouter aux favoris
    </Button>
  );
};

export default AddToFavoritesButton;
