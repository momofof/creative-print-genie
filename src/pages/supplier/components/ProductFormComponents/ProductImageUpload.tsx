
import React from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";

interface ProductImageUploadProps {
  imagePreview: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProductImageUpload = ({
  imagePreview,
  handleImageChange
}: ProductImageUploadProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Image du produit</h2>
        
        <div className="mb-4">
          {imagePreview ? (
            <div className="rounded-md overflow-hidden border border-gray-200 aspect-square flex items-center justify-center bg-gray-50">
              <img
                src={imagePreview}
                alt="Product preview"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="rounded-md border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center aspect-square bg-gray-50">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Aucune image sélectionnée</p>
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choisir une image
          </label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
          />
          <p className="mt-2 text-xs text-gray-500">
            PNG, JPG ou GIF. Taille maximale de 2MB.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
