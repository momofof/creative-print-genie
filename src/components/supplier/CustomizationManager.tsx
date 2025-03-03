
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Customization } from "@/types/dashboard";
import { PlusCircle, Trash, Edit, Save } from "lucide-react";

interface CustomizationManagerProps {
  productId: string;
}

const CustomizationManager: React.FC<CustomizationManagerProps> = ({ productId }) => {
  const [customizations, setCustomizations] = useState<Customization[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Customization>>({
    name: "",
    type: "text",
    position: "front",
    description: "",
    price_adjustment: 0,
    is_required: false
  });

  useEffect(() => {
    if (productId) {
      fetchCustomizations();
    }
  }, [productId]);

  const fetchCustomizations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('customizations')
        .select('*')
        .eq('product_id', productId)
        .order('name', { ascending: true });

      if (error) throw error;
      setCustomizations(data || []);
    } catch (error) {
      console.error("Error fetching customizations:", error);
      toast.error("Impossible de récupérer les options de personnalisation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "text",
      position: "front",
      description: "",
      price_adjustment: 0,
      is_required: false
    });
    setIsEditing(null);
  };

  const handleEditStart = (customization: Customization) => {
    setFormData({
      name: customization.name,
      type: customization.type,
      position: customization.position,
      description: customization.description,
      price_adjustment: customization.price_adjustment,
      is_required: customization.is_required
    });
    setIsEditing(customization.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const customizationData = {
        ...formData,
        product_id: productId
      };

      if (isEditing) {
        // Update existing customization
        const { error } = await supabase
          .from('customizations')
          .update(customizationData)
          .eq('id', isEditing);

        if (error) throw error;
        toast.success("Option de personnalisation mise à jour");
      } else {
        // Add new customization
        const { error } = await supabase
          .from('customizations')
          .insert(customizationData);

        if (error) throw error;
        toast.success("Option de personnalisation ajoutée");
      }

      resetForm();
      fetchCustomizations();
    } catch (error) {
      console.error("Error saving customization:", error);
      toast.error("Erreur lors de l'enregistrement de l'option de personnalisation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette option de personnalisation ?")) {
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('customizations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Option de personnalisation supprimée");
      fetchCustomizations();
    } catch (error) {
      console.error("Error deleting customization:", error);
      toast.error("Erreur lors de la suppression de l'option de personnalisation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium">Options de personnalisation</h3>
        {isEditing && (
          <Button variant="outline" onClick={resetForm}>
            Annuler
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-md bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de l'option *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Ex: Texte personnalisé, Logo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <Select 
              value={formData.type as string} 
              onValueChange={(value) => handleSelectChange("type", value)}
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
              onValueChange={(value) => handleSelectChange("position", value)}
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
              value={formData.price_adjustment}
              onChange={handleNumberInputChange}
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
            onChange={handleInputChange}
            placeholder="Décrivez cette option de personnalisation..."
            rows={2}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_required"
            checked={formData.is_required}
            onCheckedChange={(checked) => handleSwitchChange("is_required", checked)}
          />
          <Label htmlFor="is_required">Option obligatoire</Label>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Enregistrement..." : isEditing ? "Mettre à jour" : "Ajouter l'option"}
        </Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {customizations.length > 0 ? (
          customizations.map((customization) => (
            <Card key={customization.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>{customization.name}</span>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                    {customization.type === "text" ? "Texte" : "Image"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Position:</span> {customization.position === "front" ? "Avant" : 
                                                                customization.position === "back" ? "Arrière" : 
                                                                customization.position === "sleeve" ? "Manche" : "Col"}</p>
                  {customization.price_adjustment > 0 && (
                    <p><span className="font-medium">Prix:</span> +{customization.price_adjustment.toFixed(2)} €</p>
                  )}
                  {customization.description && (
                    <p className="text-gray-600 text-xs mt-2">{customization.description}</p>
                  )}
                  {customization.is_required && (
                    <p className="text-xs text-red-600 mt-1">Option obligatoire</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-end gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDelete(customization.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleEditStart(customization)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-8">
            Aucune option de personnalisation ajoutée.
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomizationManager;
