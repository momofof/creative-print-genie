
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { ProductVariant } from "../../hooks/useProductForm";
import { VariantImageUpload } from "./VariantImageUpload";

interface ProductVariantsProps {
  variants: ProductVariant[];
  variantImagePreviews?: Record<string, string>;
  addVariant: () => void;
  removeVariant: (index: number) => void;
  handleVariantChange: (index: number, field: keyof ProductVariant, value: string | number) => void;
  handleVariantImageChange?: (variantId: string, e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProductVariants = ({
  variants,
  variantImagePreviews = {},
  addVariant,
  removeVariant,
  handleVariantChange,
  handleVariantImageChange
}: ProductVariantsProps) => {
  const activeVariants = variants.filter(v => !v.isDeleted);
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Variantes du produit</h2>
          <Button 
            onClick={addVariant}
            className="bg-teal-600 hover:bg-teal-700 text-white"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
        </div>
        
        {activeVariants.length === 0 ? (
          <div className="text-center p-4 border border-dashed rounded-md">
            <p className="text-gray-500">Aucune variante pour ce produit</p>
            <p className="text-sm text-gray-400 mt-1">Cliquez sur "Ajouter" pour créer une variante</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeVariants.map((variant, index) => (
              <div 
                key={variant.id || index} 
                className="border rounded-md p-4 relative"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                  onClick={() => removeVariant(variants.indexOf(variant))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Taille */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Taille
                    </label>
                    <Select
                      value={variant.size}
                      onValueChange={(value) => handleVariantChange(variants.indexOf(variant), "size", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une taille" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="XS">XS</SelectItem>
                        <SelectItem value="S">S</SelectItem>
                        <SelectItem value="M">M</SelectItem>
                        <SelectItem value="L">L</SelectItem>
                        <SelectItem value="XL">XL</SelectItem>
                        <SelectItem value="XXL">XXL</SelectItem>
                        <SelectItem value="XXXL">XXXL</SelectItem>
                        <SelectItem value="Unique">Taille unique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Couleur */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Couleur
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={variant.color}
                        onChange={(e) => handleVariantChange(variants.indexOf(variant), "color", e.target.value)}
                        placeholder="Nom de la couleur"
                      />
                      <Input
                        type="color"
                        value={variant.hex_color}
                        onChange={(e) => handleVariantChange(variants.indexOf(variant), "hex_color", e.target.value)}
                        className="w-10 p-1 h-9"
                      />
                    </div>
                  </div>
                  
                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock
                    </label>
                    <Input
                      type="number"
                      value={variant.stock}
                      onChange={(e) => handleVariantChange(variants.indexOf(variant), "stock", e.target.value)}
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {/* Ajustement de prix */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ajustement de prix (€)
                    </label>
                    <Input
                      type="number"
                      value={variant.price_adjustment || 0}
                      onChange={(e) => handleVariantChange(variants.indexOf(variant), "price_adjustment", e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Laissez 0 si pas d'ajustement de prix pour cette variante
                    </p>
                  </div>
                  
                  {/* Statut */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Statut
                    </label>
                    <Select
                      value={variant.status}
                      onValueChange={(value) => handleVariantChange(
                        variants.indexOf(variant), 
                        "status", 
                        value as 'in_stock' | 'low_stock' | 'out_of_stock'
                      )}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Statut du stock" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in_stock">En stock</SelectItem>
                        <SelectItem value="low_stock">Stock faible</SelectItem>
                        <SelectItem value="out_of_stock">Épuisé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Image de la variante */}
                {handleVariantImageChange && variant.id && (
                  <VariantImageUpload
                    variantId={variant.id}
                    imagePreview={variantImagePreviews[variant.id] || null}
                    onImageChange={handleVariantImageChange}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
