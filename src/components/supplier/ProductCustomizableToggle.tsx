
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCustomizableToggleProps {
  isCustomizable: boolean;
  setIsCustomizable: (isCustomizable: boolean) => void;
}

const ProductCustomizableToggle: React.FC<ProductCustomizableToggleProps> = ({
  isCustomizable,
  setIsCustomizable
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="isCustomizable">Personnalisable</Label>
          <Switch
            id="isCustomizable"
            checked={isCustomizable}
            onCheckedChange={(checked) => setIsCustomizable(checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCustomizableToggle;
