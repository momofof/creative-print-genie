
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Customization } from "@/types/dashboard";

export const customizationService = {
  async addCustomization(customization: Omit<Customization, "id" | "created_at">, productId: string): Promise<Customization | null> {
    try {
      // Insérer directement dans la table product_customizations
      const { data, error } = await supabase
        .from("product_customizations")
        .insert({
          product_id: productId,
          name: customization.name,
          description: customization.description,
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
        .from("product_customizations")
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

  async updateCustomization(customization: Customization, productId: string): Promise<Customization | null> {
    try {
      const { data, error } = await supabase
        .from("product_customizations")
        .update({
          name: customization.name,
          description: customization.description,
          type: customization.type,
          position: customization.position,
          price_adjustment: customization.price_adjustment,
          is_required: customization.is_required
        })
        .eq("id", customization.id)
        .eq("product_id", productId)
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

  async deleteCustomization(customizationId: string, productId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("product_customizations")
        .delete()
        .eq("id", customizationId)
        .eq("product_id", productId);
        
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
