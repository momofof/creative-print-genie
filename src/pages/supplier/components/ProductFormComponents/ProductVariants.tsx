
import React from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductVariant } from "../../hooks/useProductVariants";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProductVariantsProps {
  variants: ProductVariant[];
  addVariant: () => void;
  removeVariant: (index: number) => void;
  handleVariantChange: (index: number, field: keyof ProductVariant, value: string | number) => void;
  errors?: any;
}

export const ProductVariants = ({
  variants,
  addVariant,
  removeVariant,
  handleVariantChange,
  errors
}: ProductVariantsProps) => {
  const activeVariants = variants.filter(v => !v.isDeleted);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Variantes du produit</h2>
          <Button 
            onClick={addVariant} 
            variant="outline" 
            size="sm"
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter une variante
          </Button>
        </div>

        {errors && Array.isArray(errors) && errors.some(error => error) && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Veuillez corriger les erreurs dans les variantes.
            </AlertDescription>
          </Alert>
        )}
        
        {activeVariants.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            Aucune variante ajoutée. Cliquez sur "Ajouter une variante" pour commencer.
          </div>
        ) : (
          <div className="space-y-6">
            {variants.map((variant, index) => {
              if (variant.isDeleted) return null;
              
              const variantErrors = errors && errors[index] ? errors[index] : null;
              
              return (
                <div 
                  key={index} 
                  className="border border-gray-200 rounded-md p-4 relative"
                >
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <FormItem>
                      <FormLabel htmlFor={`variant-${index}-size`} className="block text-sm font-medium text-gray-700">
                        Taille
                      </FormLabel>
                      <FormControl>
                        <Input
                          id={`variant-${index}-size`}
                          value={variant.size}
                          onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                          className={`mt-1 block w-full ${variantErrors?.size ? "border-red-500" : ""}`}
                          required
                        />
                      </FormControl>
                      {variantErrors?.size && (
                        <FormMessage>{variantErrors.size.message}</FormMessage>
                      )}
                    </FormItem>
                    
                    <FormItem>
                      <FormLabel htmlFor={`variant-${index}-color`} className="block text-sm font-medium text-gray-700">
                        Couleur
                      </FormLabel>
                      <FormControl>
                        <Input
                          id={`variant-${index}-color`}
                          value={variant.color}
                          onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                          className={`mt-1 block w-full ${variantErrors?.color ? "border-red-500" : ""}`}
                          required
                        />
                      </FormControl>
                      {variantErrors?.color && (
                        <FormMessage>{variantErrors.color.message}</FormMessage>
                      )}
                    </FormItem>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <FormItem>
                      <FormLabel htmlFor={`variant-${index}-hex_color`} className="block text-sm font-medium text-gray-700">
                        Code couleur (hex)
                      </FormLabel>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-8 h-8 rounded border border-gray-200" 
                          style={{ backgroundColor: variant.hex_color }}
                        />
                        <FormControl>
                          <Input
                            id={`variant-${index}-hex_color`}
                            value={variant.hex_color}
                            onChange={(e) => handleVariantChange(index, 'hex_color', e.target.value)}
                            className={`block w-full ${variantErrors?.hex_color ? "border-red-500" : ""}`}
                            required
                          />
                        </FormControl>
                      </div>
                      {variantErrors?.hex_color && (
                        <FormMessage>{variantErrors.hex_color.message}</FormMessage>
                      )}
                    </FormItem>
                    
                    <FormItem>
                      <FormLabel htmlFor={`variant-${index}-stock`} className="block text-sm font-medium text-gray-700">
                        Stock disponible
                      </FormLabel>
                      <FormControl>
                        <Input
                          id={`variant-${index}-stock`}
                          type="number"
                          min="0"
                          value={variant.stock}
                          onChange={(e) => handleVariantChange(index, 'stock', parseFloat(e.target.value) || 0)}
                          className={`mt-1 block w-full ${variantErrors?.stock ? "border-red-500" : ""}`}
                          required
                        />
                      </FormControl>
                      {variantErrors?.stock && (
                        <FormMessage>{variantErrors.stock.message}</FormMessage>
                      )}
                    </FormItem>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <FormItem>
                      <FormLabel htmlFor={`variant-${index}-price_adjustment`} className="block text-sm font-medium text-gray-700">
                        Ajustement de prix (€)
                      </FormLabel>
                      <FormControl>
                        <Input
                          id={`variant-${index}-price_adjustment`}
                          type="number"
                          step="0.01"
                          value={variant.price_adjustment || 0}
                          onChange={(e) => handleVariantChange(index, 'price_adjustment', parseFloat(e.target.value) || 0)}
                          className="mt-1 block w-full"
                        />
                      </FormControl>
                    </FormItem>
                    
                    <FormItem>
                      <FormLabel htmlFor={`variant-${index}-status`} className="block text-sm font-medium text-gray-700 mb-1">
                        Statut de stock
                      </FormLabel>
                      <Select
                        value={variant.status}
                        onValueChange={(value) => handleVariantChange(index, 'status', value as 'in_stock' | 'low_stock' | 'out_of_stock')}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in_stock">En stock</SelectItem>
                          <SelectItem value="low_stock">Stock faible</SelectItem>
                          <SelectItem value="out_of_stock">Rupture de stock</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
