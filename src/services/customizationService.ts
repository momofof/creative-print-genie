
import { toast } from "sonner";
import { Customization } from "@/types/dashboard";

export const customizationService = {
  async addCustomization(customization: Omit<Customization, "id" | "created_at">): Promise<Customization | null> {
    // Mock implementation that doesn't interact with the database
    toast.success("Personnalisation ajoutée avec succès");
    return null;
  },

  async getCustomizationsForProduct(productId: string): Promise<Customization[]> {
    // Mock implementation that doesn't interact with the database
    return [];
  },

  async updateCustomization(customization: Customization): Promise<Customization | null> {
    // Mock implementation that doesn't interact with the database
    toast.success("Personnalisation mise à jour avec succès");
    return null;
  },

  async deleteCustomization(customizationId: string): Promise<boolean> {
    // Mock implementation that doesn't interact with the database
    toast.success("Personnalisation supprimée avec succès");
    return true;
  }
};
