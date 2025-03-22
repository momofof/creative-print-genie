
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductData {
  name: string;
  price: number;
  original_price: number;
  category: string;
  subcategory: string;
  description: string | null; // Making it compatible with productTypes.ts
  image: string | null; // Making it compatible with productTypes.ts
  status: 'draft' | 'published' | 'archived';
  is_customizable: boolean;
}

interface ProductGeneralInfoProps {
  productData: ProductData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProductGeneralInfo = ({
  productData,
  handleInputChange,
  handleSelectChange,
  handleCheckboxChange
}: ProductGeneralInfoProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Informations générales</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nom du produit *
            </label>
            <Input
              id="name"
              name="name"
              value={productData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Prix (€) *
              </label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={productData.price}
                onChange={handleInputChange}
                className="mt-1 block w-full"
                required
              />
            </div>
            
            <div>
              <label htmlFor="original_price" className="block text-sm font-medium text-gray-700">
                Prix d'origine (€)
              </label>
              <Input
                id="original_price"
                name="original_price"
                type="number"
                step="0.01"
                min="0"
                value={productData.original_price || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full"
                placeholder="Facultatif"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Catégorie *
              </label>
              <Select
                value={productData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vêtements">Vêtements</SelectItem>
                  <SelectItem value="accessoires">Accessoires</SelectItem>
                  <SelectItem value="maison">Maison</SelectItem>
                  <SelectItem value="électronique">Électronique</SelectItem>
                  <SelectItem value="sport">Sport & Loisirs</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
                Sous-catégorie *
              </label>
              <Input
                id="subcategory"
                name="subcategory"
                value={productData.subcategory || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={productData.description || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full"
              rows={5}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut du produit
            </label>
            <Select
              value={productData.status}
              onValueChange={(value) => handleSelectChange("status", value as 'draft' | 'published' | 'archived')}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="published">Publié</SelectItem>
                <SelectItem value="archived">Archivé</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center">
            <input
              id="is_customizable"
              name="is_customizable"
              type="checkbox"
              checked={productData.is_customizable}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
            />
            <label htmlFor="is_customizable" className="ml-2 block text-sm text-gray-700">
              Ce produit est personnalisable
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
