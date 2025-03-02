
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface ProductDescriptionProps {
  description: string;
  setDescription: (description: string) => void;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  description,
  setDescription
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductDescription;
