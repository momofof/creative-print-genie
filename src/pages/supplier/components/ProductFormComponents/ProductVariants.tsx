
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { ProductVariant } from "@/types/dashboard";
import { VariantImageUpload } from "./VariantImageUpload";
import { useVariantParser } from "../../hooks/useVariantParser";

interface ProductVariantsProps {
  variants: ProductVariant[];
  productId?: string;
  variantImagePreviews?: Record<string, string[]>;
  addVariant: () => void;
  removeVariant: (index: number) => void;
  handleVariantChange: (index: number, field: keyof ProductVariant, value: string | number) => void;
  handleVariantImageChange?: (variantId: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  handleVariantImageDelete?: (variantId: string, imageUrl: string) => void;
  variantOptions?: Record<string, string[]>;
}

export const ProductVariants = ({
  variants,
  productId,
  variantImagePreviews = {},
  addVariant,
  removeVariant,
  handleVariantChange,
  handleVariantImageChange,
  handleVariantImageDelete,
  variantOptions = {}
}: ProductVariantsProps) => {
  const { parseSimpleArrayString } = useVariantParser();
  const activeVariants = variants.filter(v => !v.isDeleted);
  
  const fieldGroups = [
    {
      title: "Informations de base",
      fields: [
        { name: "size", label: "Taille", type: "select", options: variantOptions.size_options || ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Unique"] },
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
        { name: "format", label: "Format", type: "select", options: variantOptions.format_options || [] },
        { name: "poids", label: "Poids", type: "select", options: variantOptions.poids_options || [] },
        { name: "quantite", label: "Quantité", type: "select", options: variantOptions.quantite_options || [] },
        { name: "types_impression", label: "Types d'impression", type: "select", options: variantOptions.types_impression_options || [] },
        { name: "details_impression", label: "Détails d'impression", type: "select", options: variantOptions.details_impression_options || [] },
        { name: "orientation_impression", label: "Orientation", type: "select", options: variantOptions.orientation_impression_options || [] },
      ]
    },
    {
      title: "Matériaux et options",
      fields: [
        { name: "type_de_materiaux", label: "Type de matériaux", type: "select", options: variantOptions.type_de_materiaux_options || [] },
        { name: "bat", label: "BAT", type: "select", options: variantOptions.bat_options || [] },
        { name: "echantillon", label: "Échantillon", type: "select", options: variantOptions.echantillon_options || [] },
      ]
    }
  ];

  // Helper pour vérifier si un champ dispose d'options
  const hasOptions = (fieldName: string): boolean => {
    const optionsKey = `${fieldName}_options`;
    return Array.isArray(variantOptions[optionsKey]) && variantOptions[optionsKey].length > 0;
  };
  
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
                
                {fieldGroups.map((group, groupIndex) => (
                  <div key={groupIndex} className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">{group.title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {group.fields.map((field) => {
                        const fieldKey = field.name as keyof ProductVariant;
                        const fieldValue = variant[fieldKey]?.toString() || '';
                        const variantIndex = variants.indexOf(variant);
                        const isSelectField = field.type === 'select';
                        
                        // Déterminer les options pour les champs select
                        let selectOptions = [];
                        if (isSelectField) {
                          if (Array.isArray(field.options)) {
                            selectOptions = field.options;
                          } else if (typeof field.options === 'string') {
                            const optionsKey = `${field.name}_options`;
                            selectOptions = variantOptions[optionsKey] || [];
                          }
                        }

                        return (
                          <div key={field.name}>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              {field.label}
                            </label>
                            {isSelectField ? (
                              <Select
                                value={fieldValue}
                                onValueChange={(value) => handleVariantChange(variantIndex, fieldKey, value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder={`Choisir ${field.label.toLowerCase()}`} />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  {Array.isArray(selectOptions) ? 
                                    selectOptions.map((option) => (
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
                                value={fieldValue || '#000000'}
                                onChange={(e) => handleVariantChange(variantIndex, fieldKey, e.target.value)}
                                className="w-full p-1 h-9"
                              />
                            ) : (
                              <Input
                                type={field.type}
                                value={fieldValue}
                                onChange={(e) => handleVariantChange(variantIndex, fieldKey, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                                placeholder={`Entrez ${field.label.toLowerCase()}`}
                                step={field.type === 'number' ? "0.01" : undefined}
                                min={field.type === 'number' ? "0" : undefined}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {handleVariantImageChange && variant.id && (
                  <VariantImageUpload
                    variantId={variant.id}
                    productId={productId}
                    imagePreview={null}
                    imagesList={variantImagePreviews[variant.id] || []}
                    onImageChange={handleVariantImageChange}
                    onImageDelete={handleVariantImageDelete}
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
