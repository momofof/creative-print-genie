
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Plus, Image as ImageIcon, Trash2 } from "lucide-react";

interface VariantImageUploadProps {
  variantId: string;
  productId?: string;
  imagePreview: string | null;
  imagesList?: string[];
  onImageChange: (variantId: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageDelete?: (variantId: string, imageUrl: string) => void;
}

export const VariantImageUpload = ({
  variantId,
  productId,
  imagePreview,
  imagesList = [],
  onImageChange,
  onImageDelete
}: VariantImageUploadProps) => {
  const [showImageInput, setShowImageInput] = useState(false);

  return (
    <div className="mt-2 border-t pt-2">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Images de la variante
        </label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={() => setShowImageInput(!showImageInput)}
          className="h-8 px-2 text-xs"
        >
          {showImageInput ? (
            <X className="h-3 w-3 mr-1" />
          ) : (
            <Plus className="h-3 w-3 mr-1" />
          )}
          {showImageInput ? "Annuler" : "Ajouter une image"}
        </Button>
      </div>
      
      {/* Affichage des images existantes */}
      {(imagesList.length > 0 || imagePreview) && (
        <div className="mb-3 flex flex-wrap gap-2">
          {imagePreview && (
            <div className="relative group">
              <div className="rounded-md overflow-hidden border border-gray-200 w-14 h-14 flex items-center justify-center bg-gray-50">
                <img
                  src={imagePreview}
                  alt="Variant preview"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  className="text-white p-1 rounded-full bg-red-500"
                  onClick={() => onImageDelete && imagePreview && onImageDelete(variantId, imagePreview)}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
          
          {imagesList.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="rounded-md overflow-hidden border border-gray-200 w-14 h-14 flex items-center justify-center bg-gray-50">
                <img
                  src={imageUrl}
                  alt={`Variante ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  className="text-white p-1 rounded-full bg-red-500"
                  onClick={() => onImageDelete && onImageDelete(variantId, imageUrl)}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
          
          {imagesList.length === 0 && !imagePreview && (
            <div className="rounded-md border border-dashed border-gray-300 p-2 flex flex-col items-center justify-center w-14 h-14 bg-gray-50">
              <ImageIcon className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-500 mt-1">Aucune image</span>
            </div>
          )}
        </div>
      )}
      
      {/* Formulaire d'ajout d'image */}
      {showImageInput && (
        <div className="mb-3">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              onImageChange(variantId, e);
              setShowImageInput(false);
            }}
            className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-teal-50 file:text-teal-700"
          />
        </div>
      )}
    </div>
  );
};
