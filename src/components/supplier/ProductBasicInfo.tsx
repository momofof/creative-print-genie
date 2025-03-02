
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductStatus } from '@/types/product';

interface ProductBasicInfoProps {
  name: string;
  setName: (name: string) => void;
  price: number;
  setPrice: (price: number) => void;
  originalPrice: number | undefined;
  setOriginalPrice: (price: number | undefined) => void;
  category: string;
  setCategory: (category: string) => void;
  subcategory: string;
  setSubcategory: (subcategory: string) => void;
  status: ProductStatus;
  setStatus: (status: ProductStatus) => void;
}

const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({
  name,
  setName,
  price,
  setPrice,
  originalPrice,
  setOriginalPrice,
  category,
  setCategory,
  subcategory,
  setSubcategory,
  status,
  setStatus
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div>
            <Label htmlFor="name">Nom du produit</Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price">Prix</Label>
            <Input
              type="number"
              id="price"
              value={price.toString()}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              required
            />
          </div>

          {/* Original Price */}
          <div>
            <Label htmlFor="originalPrice">Prix d'origine (facultatif)</Label>
            <Input
              type="number"
              id="originalPrice"
              value={originalPrice !== undefined ? originalPrice.toString() : ''}
              onChange={(e) =>
                setOriginalPrice(e.target.value ? parseFloat(e.target.value) : undefined)
              }
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category">Catégorie</Label>
            <Input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>

          {/* Subcategory */}
          <div>
            <Label htmlFor="subcategory">Sous-catégorie</Label>
            <Input
              type="text"
              id="subcategory"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              required
            />
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Statut</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as ProductStatus)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="published">Publié</SelectItem>
                <SelectItem value="archived">Archivé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductBasicInfo;
