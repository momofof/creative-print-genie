
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, X, Plus, Save } from "lucide-react";
import { ProductVariant } from "@/types/dashboard";
import { VariantImageUpload } from "./VariantImageUpload";

interface SimpleVariantEditorProps {
  variants: ProductVariant[];
  onVariantsChange: (variants: ProductVariant[]) => void;
}

export const SimpleVariantEditor: React.FC<SimpleVariantEditorProps> = ({ 
  variants, 
  onVariantsChange 
}) => {
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [variantForm, setVariantForm] = useState<ProductVariant | null>(null);
  const [baseVariantForm, setBaseVariantForm] = useState<{ size: string; color: string; hex_color: string }>({
    size: "",
    color: "",
    hex_color: "#000000",
  });
  const [variantImagePreview, setVariantImagePreview] = useState<string | null>(null);

  const handleImageChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVariantImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setVariantImagePreview(null);
    }
  };

  const handleDeleteVariant = (id: string) => {
    const updatedVariants = variants.filter((v) => v.id !== id);
    onVariantsChange(updatedVariants);
  };

  const handleEditVariant = (variant: ProductVariant) => {
    setEditingVariantId(variant.id);
    setVariantForm({ ...variant });
    setVariantImagePreview(variant.image_url || null);
  };

  const handleSaveVariant = () => {
    if (!variantForm) return;

    const updatedVariants = variants.map((v) =>
      v.id === variantForm.id ? { ...variantForm } : v
    );

    onVariantsChange(updatedVariants);
    setEditingVariantId(null);
    setVariantForm(null);
    setVariantImagePreview(null);
  };

  const handleAddVariant = () => {
    const newVariant = createBaseVariant();
    if (newVariant) {
      const updatedVariants = [...variants, newVariant];
      onVariantsChange(updatedVariants);
      setBaseVariantForm({ size: "", color: "", hex_color: "#000000" });
    }
  };

  const createBaseVariant = () => {
    if (!baseVariantForm.size && !baseVariantForm.color) {
      alert("Veuillez entrer au moins une taille ou une couleur");
      return null;
    }
    
    const variant: ProductVariant = {
      id: crypto.randomUUID(),
      product_id: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      size: baseVariantForm.size || null,
      color: baseVariantForm.color || null,
      hex_color: baseVariantForm.hex_color || null,
      stock: 0,
      price_adjustment: 0,
      status: "in_stock",
    };

    return variant;
  };

  const renderVariantForm = () => {
    if (!variantForm) return null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Taille</label>
            <input
              type="text"
              value={variantForm.size || ""}
              onChange={(e) =>
                setVariantForm({ ...variantForm, size: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Couleur</label>
            <input
              type="text"
              value={variantForm.color || ""}
              onChange={(e) =>
                setVariantForm({ ...variantForm, color: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Code Hex Couleur</label>
            <input
              type="color"
              value={variantForm.hex_color || "#000000"}
              onChange={(e) =>
                setVariantForm({ ...variantForm, hex_color: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 h-10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              value={variantForm.stock || 0}
              onChange={(e) =>
                setVariantForm({
                  ...variantForm,
                  stock: parseInt(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ajustement de prix</label>
            <input
              type="number"
              value={variantForm.price_adjustment || 0}
              onChange={(e) =>
                setVariantForm({
                  ...variantForm,
                  price_adjustment: parseFloat(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
        </div>
        <VariantImageUpload
          variantId={variantForm.id}
          productId=""
          imagePreview={variantImagePreview}
          imagesList={[]}
          onImageChange={(variantId, e) => {
            const file = e.target.files?.[0];
            if (file) handleImageChange(file);
          }}
        />
        <Button onClick={handleSaveVariant} className="bg-teal-600 text-white">
          <Save className="h-4 w-4 mr-2" />
          Enregistrer
        </Button>
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <h2 className="text-lg font-semibold">Variantes</h2>
        <div className="space-y-2">
          {variants.map((variant) => (
            <div
              key={variant.id}
              className="flex items-center justify-between p-2 border rounded-md"
            >
              <div>
                {variant.size && <span>Taille: {variant.size}</span>}
                {variant.color && <span>, Couleur: {variant.color}</span>}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEditVariant(variant)}
                  size="icon"
                  variant="outline"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => handleDeleteVariant(variant.id)}
                  size="icon"
                  variant="destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        {editingVariantId ? (
          renderVariantForm()
        ) : (
          <div className="space-y-3">
            <h3 className="text-md font-semibold">Ajouter une variante</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Taille</label>
                <input
                  type="text"
                  value={baseVariantForm.size}
                  onChange={(e) =>
                    setBaseVariantForm({ ...baseVariantForm, size: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Couleur</label>
                <input
                  type="text"
                  value={baseVariantForm.color}
                  onChange={(e) =>
                    setBaseVariantForm({ ...baseVariantForm, color: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Code Hex Couleur</label>
                <input
                  type="color"
                  value={baseVariantForm.hex_color}
                  onChange={(e) =>
                    setBaseVariantForm({ ...baseVariantForm, hex_color: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 h-10"
                />
              </div>
            </div>
            <Button onClick={handleAddVariant} className="bg-teal-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une variante
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
