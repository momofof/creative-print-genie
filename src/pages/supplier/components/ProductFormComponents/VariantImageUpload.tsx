
import React from "react";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

interface VariantImageUploadProps {
  variantId: string;
  imagePreview: string | null;
  onImageChange: (variantId: string, e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const VariantImageUpload = ({
  variantId,
  imagePreview,
  onImageChange
}: VariantImageUploadProps) => {
  return (
    <div className="mt-2 border-t pt-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Image de la variante
      </label>
      
      <div className="mb-2">
        {imagePreview ? (
          <div className="rounded-md overflow-hidden border border-gray-200 w-14 h-14 flex items-center justify-center bg-gray-50">
            <img
              src={imagePreview}
              alt="Variant preview"
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-gray-300 p-2 flex flex-col items-center justify-center w-14 h-14 bg-gray-50">
            <Upload className="h-4 w-4 text-gray-400" />
          </div>
        )}
      </div>
      
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => onImageChange(variantId, e)}
        className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-teal-50 file:text-teal-700"
      />
    </div>
  );
};
