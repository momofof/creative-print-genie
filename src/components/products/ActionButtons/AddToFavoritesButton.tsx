
import React from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface AddToFavoritesButtonProps {
  onClick: () => Promise<void> | void;
  isLoading?: boolean;
  isFavorite?: boolean;
}

const AddToFavoritesButton = ({ 
  onClick,
  isLoading = false,
  isFavorite = false
}: AddToFavoritesButtonProps) => {
  return (
    <Button 
      variant="outline" 
      className={`w-full py-6 text-base font-medium flex items-center justify-center gap-2 ${isFavorite ? 'bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100' : ''}`}
      onClick={onClick}
      disabled={isLoading}
    >
      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-pink-500 text-pink-500' : ''}`} />
      {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    </Button>
  );
};

export default AddToFavoritesButton;
