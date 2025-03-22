
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
  
  // Grouper les champs en catégories pour une meilleure organisation
  const fieldGroups = [
    {
      title: "Informations de base",
      fields: [
        { name: "size", label: "Taille", type: "select", options: ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Unique"] },
        { name: "color", label: "Couleur", type: "text" },
        { name: "hex_color", label: "Code couleur", type: "color" },
        { name: "stock", label: "Stock", type: "number" },
      ]
    },
    {
      title: "Attributs avancés",
      fields: [
        { name: "price_adjustment", label: "Ajustement de prix (€)", type: "number" },
        { name: "status", label: "Statut", type: "select", options: [
          { value: "in_stock", label: "En stock" },
          { value: "low_stock", label: "Stock faible" },
          { value: "out_of_stock", label: "Épuisé" }
        ]},
      ]
    },
    {
      title: "Attributs d'impression",
      fields: [
        { name: "format", label: "Format", type: "text" },
        { name: "poids", label: "Poids", type: "text" },
        { name: "quantite", label: "Quantité", type: "text" },
        { name: "types_impression", label: "Types d'impression", type: "text" },
        { name: "details_impression", label: "Détails d'impression", type: "text" },
        { name: "orientation_impression", label: "Orientation", type: "text" },
      ]
    },
    {
      title: "Matériaux et options",
      fields: [
        { name: "type_de_materiaux", label: "Type de matériaux", type: "text" },
        { name: "bat", label: "BAT", type: "text" },
        { name: "echantillon", label: "Échantillon", type: "text" },
      ]
    }
  ];
  
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
                
                {/* Affichage tabulaire des champs par groupe */}
                {fieldGroups.map((group, groupIndex) => (
                  <div key={groupIndex} className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">{group.title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {group.fields.map((field) => (
                        <div key={field.name}>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            {field.label}
                          </label>
                          {field.type === 'select' ? (
                            <Select
                              value={variant[field.name as keyof ProductVariant]?.toString() || ''}
                              onValueChange={(value) => handleVariantChange(variants.indexOf(variant), field.name as keyof ProductVariant, value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={`Choisir ${field.label.toLowerCase()}`} />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.isArray(field.options) ? 
                                  field.options.map((option) => (
                                    typeof option === 'string' ? 
                                      <SelectItem key={option} value={option}>{option}</SelectItem> :
                                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                  )) : null
                                }
                              </SelectContent>
                            </Select>
                          ) : field.type === 'color' ? (
                            <Input
                              type="color"
                              value={variant[field.name as keyof ProductVariant]?.toString() || '#000000'}
                              onChange={(e) => handleVariantChange(variants.indexOf(variant), field.name as keyof ProductVariant, e.target.value)}
                              className="w-full p-1 h-9"
                            />
                          ) : (
                            <Input
                              type={field.type}
                              value={variant[field.name as keyof ProductVariant]?.toString() || ''}
                              onChange={(e) => handleVariantChange(variants.indexOf(variant), field.name as keyof ProductVariant, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                              placeholder={`Entrez ${field.label.toLowerCase()}`}
                              step={field.type === 'number' ? "0.01" : undefined}
                              min={field.type === 'number' ? "0" : undefined}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

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
