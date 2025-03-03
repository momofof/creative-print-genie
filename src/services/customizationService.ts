
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Customization } from "@/types/dashboard";

export const customizationService = {
  async addCustomization(customization: Omit<Customization, "id" | "created_at">): Promise<Customization | null> {
    try {
      const { data, error } = await supabase
        .from("customizations")
        .insert({
          name: customization.name,
          description: customization.description,
          product_id: customization.product_id,
          type: customization.type,
          position: customization.position,
          price_adjustment: customization.price_adjustment,
          is_required: customization.is_required
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error: any) {
      toast.error(`Erreur lors de l'ajout de la personnalisation: ${error.message}`);
      return null;
    }
  },

  async getCustomizationsForProduct(productId: string): Promise<Customization[]> {
    try {
      const { data, error } = await supabase
        .from("customizations")
        .select("*")
        .eq("product_id", productId);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error: any) {
      toast.error(`Erreur lors de la récupération des personnalisations: ${error.message}`);
      return [];
    }
  },

  async updateCustomization(customization: Customization): Promise<Customization | null> {
    try {
      const { data, error } = await supabase
        .from("customizations")
        .update({
          name: customization.name,
          description: customization.description,
          type: customization.type,
          position: customization.position,
          price_adjustment: customization.price_adjustment,
          is_required: customization.is_required
        })
        .eq("id", customization.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error: any) {
      toast.error(`Erreur lors de la mise à jour de la personnalisation: ${error.message}`);
      return null;
    }
  },

  async deleteCustomization(customizationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("customizations")
        .delete()
        .eq("id", customizationId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error: any) {
      toast.error(`Erreur lors de la suppression de la personnalisation: ${error.message}`);
      return false;
    }
  }
};
