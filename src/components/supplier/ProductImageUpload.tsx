
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";

interface ProductImageUploadProps {
  image: string;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement> | Event) => void;
}

const ProductImageUpload: React.FC<ProductImageUploadProps> = ({ 
  image, 
  handleImageChange 
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div>
          <Label htmlFor="image">Image du produit</Label>
          <div className="flex items-center space-x-4 mt-2">
            <div className="w-32 h-32 rounded-md overflow-hidden">
              {image ? (
                <img src={image} alt="Product" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  Aucune image
                </div>
              )}
            </div>
            <div>
              <Input
                type="file"
                id="image"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <Label htmlFor="image" className="bg-accent text-accent-foreground rounded-full py-2 px-4 hover:bg-accent/90 cursor-pointer">
                <UploadCloud className="h-4 w-4 mr-2 inline-block" />
                Télécharger
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductImageUpload;
