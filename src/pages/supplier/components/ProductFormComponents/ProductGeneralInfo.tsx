
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
import { useFormContext } from "react-hook-form";
import { ProductFormValues } from "../../schema/productFormSchema";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface ProductData {
  name: string;
  price: number;
  original_price: number | null;
  category: string;
  subcategory: string | null;
  description: string | null;
  image: string | null;
  status: 'draft' | 'published' | 'archived';
  is_customizable: boolean;
}

interface ProductGeneralInfoProps {
  productData: ProductData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: any;
}

export const ProductGeneralInfo = ({
  productData,
  handleInputChange,
  handleSelectChange,
  handleCheckboxChange,
  errors
}: ProductGeneralInfoProps) => {
  const { register } = useFormContext<ProductFormValues>();

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Informations générales</h2>
        
        <div className="space-y-4">
          <FormItem>
            <FormLabel htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nom du produit *
            </FormLabel>
            <FormControl>
              <Input
                id="name"
                {...register("name", { 
                  onChange: handleInputChange 
                })}
                className={`mt-1 block w-full ${errors?.name ? "border-red-500" : ""}`}
                required
              />
            </FormControl>
            {errors?.name && (
              <FormMessage>{errors.name.message}</FormMessage>
            )}
          </FormItem>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormItem>
              <FormLabel htmlFor="price" className="block text-sm font-medium text-gray-700">
                Prix (€) *
              </FormLabel>
              <FormControl>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("price", { 
                    valueAsNumber: true,
                    onChange: handleInputChange
                  })}
                  className={`mt-1 block w-full ${errors?.price ? "border-red-500" : ""}`}
                  required
                />
              </FormControl>
              {errors?.price && (
                <FormMessage>{errors.price.message}</FormMessage>
              )}
            </FormItem>
            
            <FormItem>
              <FormLabel htmlFor="original_price" className="block text-sm font-medium text-gray-700">
                Prix d'origine (€)
              </FormLabel>
              <FormControl>
                <Input
                  id="original_price"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("original_price", { 
                    valueAsNumber: true,
                    onChange: handleInputChange
                  })}
                  className="mt-1 block w-full"
                  placeholder="Facultatif"
                />
              </FormControl>
            </FormItem>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormItem>
              <FormLabel htmlFor="category" className="block text-sm font-medium text-gray-700">
                Catégorie *
              </FormLabel>
              <Select
                defaultValue={productData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger className={`mt-1 w-full ${errors?.category ? "border-red-500" : ""}`}>
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
              {errors?.category && (
                <FormMessage>{errors.category.message}</FormMessage>
              )}
            </FormItem>
            
            <FormItem>
              <FormLabel htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
                Sous-catégorie
              </FormLabel>
              <FormControl>
                <Input
                  id="subcategory"
                  {...register("subcategory", { 
                    onChange: handleInputChange 
                  })}
                  className="mt-1 block w-full"
                  placeholder="Facultatif"
                />
              </FormControl>
            </FormItem>
          </div>
          
          <FormItem>
            <FormLabel htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </FormLabel>
            <FormControl>
              <Textarea
                id="description"
                {...register("description", { 
                  onChange: handleInputChange 
                })}
                className="mt-1 block w-full"
                rows={5}
              />
            </FormControl>
          </FormItem>
          
          <FormItem>
            <FormLabel className="block text-sm font-medium text-gray-700 mb-2">
              Statut du produit
            </FormLabel>
            <Select
              defaultValue={productData.status}
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
          </FormItem>
          
          <div className="flex items-center">
            <input
              id="is_customizable"
              type="checkbox"
              checked={productData.is_customizable}
              {...register("is_customizable", { 
                onChange: handleCheckboxChange 
              })}
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
