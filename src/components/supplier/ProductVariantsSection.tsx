
import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductVariant } from "@/types/supplier";

interface ProductVariantsSectionProps {
  variants: ProductVariant[];
  onVariantChange: (index: number, field: keyof ProductVariant, value: string | number) => void;
  onAddVariant: () => void;
  onRemoveVariant: (index: number) => void;
}

const ProductVariantsSection: React.FC<ProductVariantsSectionProps> = ({
  variants,
  onVariantChange,
  onAddVariant,
  onRemoveVariant
}) => {
  const visibleVariants = variants.filter(v => !v.isDeleted);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Variantes de produit</h2>
          <Button 
            type="button" 
            onClick={onAddVariant}
            variant="outline"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter une variante
          </Button>
        </div>
        
        {visibleVariants.length === 0 && (
          <div className="text-center py-6 bg-gray-50 rounded-md">
            <p className="text-gray-500">Aucune variante pour ce produit</p>
            <Button 
              type="button" 
              onClick={onAddVariant}
              variant="ghost"
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-1" />
              Ajouter une variante
            </Button>
          </div>
        )}
        
        {visibleVariants.map((variant, index) => (
          <div 
            key={variant.id || index}
            className="border rounded-md p-4 mb-4 last:mb-0"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium">Variante #{index + 1}</h3>
              <Button
                type="button"
                onClick={() => onRemoveVariant(index)}
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Taille
                </label>
                <Select
                  value={variant.size}
                  onValueChange={(value) => onVariantChange(index, "size", value)}
                >
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="XS">XS</SelectItem>
                    <SelectItem value="S">S</SelectItem>
                    <SelectItem value="M">M</SelectItem>
                    <SelectItem value="L">L</SelectItem>
                    <SelectItem value="XL">XL</SelectItem>
                    <SelectItem value="XXL">XXL</SelectItem>
                    <SelectItem value="Unique">Taille unique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Couleur
                </label>
                <div className="flex mt-1">
                  <Input
                    type="color"
                    value={variant.hex_color}
                    onChange={(e) => onVariantChange(index, "hex_color", e.target.value)}
                    className="w-10 h-10 p-0 border-0 rounded-l-md"
                  />
                  <Input
                    value={variant.color}
                    onChange={(e) => onVariantChange(index, "color", e.target.value)}
                    className="flex-1 rounded-l-none"
                    placeholder="Nom de la couleur"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Stock
                </label>
                <Input
                  type="number"
                  min="0"
                  value={variant.stock}
                  onChange={(e) => onVariantChange(index, "stock", e.target.value)}
                  className="mt-1 w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ajustement prix (€)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={variant.price_adjustment || 0}
                  onChange={(e) => onVariantChange(index, "price_adjustment", e.target.value)}
                  className="mt-1 w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Statut
                </label>
                <Select
                  value={variant.status}
                  onValueChange={(value) => onVariantChange(index, "status", value as 'in_stock' | 'low_stock' | 'out_of_stock')}
                >
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_stock">En stock</SelectItem>
                    <SelectItem value="low_stock">Stock faible</SelectItem>
                    <SelectItem value="out_of_stock">En rupture</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProductVariantsSection;
