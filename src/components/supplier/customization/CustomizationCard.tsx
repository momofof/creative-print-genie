
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash, Edit } from "lucide-react";
import { Customization } from "@/types/dashboard";

interface CustomizationCardProps {
  customization: Customization;
  onDelete: (id: string) => void;
  onEdit: (customization: Customization) => void;
}

const CustomizationCard: React.FC<CustomizationCardProps> = ({
  customization,
  onDelete,
  onEdit
}) => {
  const getPositionLabel = (position: string): string => {
    switch (position) {
      case "front": return "Avant";
      case "back": return "Arrière";
      case "sleeve": return "Manche";
      case "collar": return "Col";
      default: return position;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>{customization.name}</span>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
            {customization.type === "text" ? "Texte" : "Image"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm space-y-1">
          <p><span className="font-medium">Position:</span> {getPositionLabel(customization.position)}</p>
          {customization.price_adjustment > 0 && (
            <p><span className="font-medium">Prix:</span> +{customization.price_adjustment.toFixed(2)} €</p>
          )}
          {customization.description && (
            <p className="text-gray-600 text-xs mt-2">{customization.description}</p>
          )}
          {customization.is_required && (
            <p className="text-xs text-red-600 mt-1">Option obligatoire</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-end gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onDelete(customization.id)}
        >
          <Trash className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onEdit(customization)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CustomizationCard;
