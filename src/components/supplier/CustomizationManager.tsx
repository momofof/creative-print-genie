
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Customization } from "@/types/dashboard";
import { PlusCircle } from "lucide-react";
import CustomizationForm from "./customization/CustomizationForm";
import CustomizationList from "./customization/CustomizationList";
import { fetchCustomizations, createCustomization, updateCustomization, deleteCustomization } from "@/services/customizationService";

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
      loadCustomizations();
    }
  }, [productId]);

  const loadCustomizations = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCustomizations(productId);
      setCustomizations(data);
    } catch (error) {
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
        await updateCustomization(isEditing, customizationData);
        toast.success("Option de personnalisation mise à jour");
      } else {
        await createCustomization(customizationData);
        toast.success("Option de personnalisation ajoutée");
      }

      resetForm();
      loadCustomizations();
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
      await deleteCustomization(id);
      toast.success("Option de personnalisation supprimée");
      loadCustomizations();
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

      <CustomizationForm
        formData={formData}
        isLoading={isLoading}
        isEditing={!!isEditing}
        onInputChange={handleInputChange}
        onNumberInputChange={handleNumberInputChange}
        onSelectChange={handleSelectChange}
        onSwitchChange={handleSwitchChange}
        onSubmit={handleSubmit}
      />

      <CustomizationList
        customizations={customizations}
        onDelete={handleDelete}
        onEdit={handleEditStart}
      />
    </div>
  );
};

export default CustomizationManager;
