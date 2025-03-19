
import React from "react";
import { Shirt, BookImage, Tv, Umbrella, UtensilsCrossed, Camera } from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  textile: <Shirt className="h-6 w-6" />,
  papier: <BookImage className="h-6 w-6" />,
  vinyl: <Tv className="h-6 w-6" />,
  accessoires: <Umbrella className="h-6 w-6" />,
  ustensiles: <UtensilsCrossed className="h-6 w-6" />,
  bijoux: <Camera className="h-6 w-6" />,
  // For other categories, use a default icon
  default: <Shirt className="h-6 w-6" />
};

interface CategoryIconProps {
  categoryId: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ categoryId }) => {
  return categoryIcons[categoryId] || categoryIcons.default;
};

export default CategoryIcon;
