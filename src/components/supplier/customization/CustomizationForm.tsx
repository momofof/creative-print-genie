
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Customization } from "@/types/dashboard";

interface CustomizationFormProps {
  formData: Partial<Customization>;
  isLoading: boolean;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onNumberInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onSwitchChange: (name: string, checked: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const CustomizationForm: React.FC<CustomizationFormProps> = ({
  formData,
  isLoading,
  isEditing,
  onInputChange,
  onNumberInputChange,
  onSelectChange,
  onSwitchChange,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 border p-4 rounded-md bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom de l'option *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name || ""}
            onChange={onInputChange}
            required
            placeholder="Ex: Texte personnalisé, Logo"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <Select 
            value={formData.type as string} 
            onValueChange={(value) => onSelectChange("type", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Texte</SelectItem>
              <SelectItem value="image">Image</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="position">Position *</Label>
          <Select 
            value={formData.position as string} 
            onValueChange={(value) => onSelectChange("position", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir une position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="front">Avant</SelectItem>
              <SelectItem value="back">Arrière</SelectItem>
              <SelectItem value="sleeve">Manche</SelectItem>
              <SelectItem value="collar">Col</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price_adjustment">Ajustement de prix (€)</Label>
          <Input
            id="price_adjustment"
            name="price_adjustment"
            type="number"
            min="0"
            step="0.01"
            value={formData.price_adjustment?.toString() || "0"}
            onChange={onNumberInputChange}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={onInputChange}
          placeholder="Décrivez cette option de personnalisation..."
          rows={2}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_required"
          checked={formData.is_required || false}
          onCheckedChange={(checked) => onSwitchChange("is_required", checked)}
        />
        <Label htmlFor="is_required">Option obligatoire</Label>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Enregistrement..." : isEditing ? "Mettre à jour" : "Ajouter l'option"}
      </Button>
    </form>
  );
};

export default CustomizationForm;
