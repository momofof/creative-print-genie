
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { ProductVariant } from "../../hooks/product-form/types";
import VariantItem from "./VariantComponents/VariantItem";

interface ProductVariantsProps {
  variants: ProductVariant[];
  addVariant: () => void;
  removeVariant: (index: number) => void;
  handleVariantChange: (index: number, field: keyof ProductVariant, value: string | number | string[]) => void;
  productCategory?: string;
}

export const ProductVariants = ({
  variants,
  addVariant,
  removeVariant,
  handleVariantChange,
  productCategory
}: ProductVariantsProps) => {
  const nonDeletedVariants = variants.filter(v => !v.isDeleted);
  const isVelo = productCategory === "vélo" || productCategory === "velo";
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Variantes de produit</h2>
          <Button 
            type="button" 
            onClick={addVariant}
            variant="outline"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter une variante
          </Button>
        </div>
        
        {nonDeletedVariants.length === 0 && (
          <div className="text-center py-6 bg-gray-50 rounded-md">
            <p className="text-gray-500">Aucune variante pour ce produit</p>
            <Button 
              type="button" 
              onClick={addVariant}
              variant="ghost"
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-1" />
              Ajouter une variante
            </Button>
          </div>
        )}
        
        {nonDeletedVariants.map((variant, index) => (
          <VariantItem 
            key={variant.id || index}
            variant={variant}
            index={index}
            onRemove={() => removeVariant(index)}
            onChange={handleVariantChange}
            isVelo={isVelo}
          />
        ))}
      </CardContent>
    </Card>
  );
};
