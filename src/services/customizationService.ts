
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Customization } from "@/types/dashboard";
import { Json } from "@/integrations/supabase/types";
import { parseJsonArray, parseCustomizations, toJsonValue } from "@/utils/jsonUtils";

export const customizationService = {
  async addCustomization(customization: Omit<Customization, "id" | "created_at">, productId: string): Promise<Customization | null> {
    try {
      // Get the current product with its customizations
      const { data: product, error: fetchError } = await supabase
        .from("unified_products")
        .select("customizations")
        .eq("id", productId)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Create a new customization object with ID
      const newCustomization: Customization = {
        id: crypto.randomUUID(),
        name: customization.name,
        description: customization.description,
        type: customization.type,
        position: customization.position,
        price_adjustment: customization.price_adjustment,
        is_required: customization.is_required,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Parse the existing customizations and append the new one
      const currentCustomizations = parseCustomizations(product.customizations);
      const updatedCustomizations = [...currentCustomizations, newCustomization];
      
      // Update the product with the new customizations array
      const { error: updateError } = await supabase
        .from("unified_products")
        .update({ customizations: toJsonValue(updatedCustomizations) })
        .eq("id", productId);
        
      if (updateError) {
        throw updateError;
      }
      
      return newCustomization;
    } catch (error: any) {
      toast.error(`Erreur lors de l'ajout de la personnalisation: ${error.message}`);
      return null;
    }
  },

  async getCustomizationsForProduct(productId: string): Promise<Customization[]> {
    try {
      const { data, error } = await supabase
        .from("unified_products")
        .select("customizations")
        .eq("id", productId)
        .single();
      
      if (error) {
        throw error;
      }
      
      return parseCustomizations(data.customizations);
    } catch (error: any) {
      toast.error(`Erreur lors de la récupération des personnalisations: ${error.message}`);
      return [];
    }
  },

  async updateCustomization(customization: Customization, productId: string): Promise<Customization | null> {
    try {
      // Get the current product with its customizations
      const { data: product, error: fetchError } = await supabase
        .from("unified_products")
        .select("customizations")
        .eq("id", productId)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Parse and update the customization in the array
      const currentCustomizations = parseCustomizations(product.customizations);
      const updatedCustomizations = currentCustomizations.map((custom: Customization) => 
        custom.id === customization.id ? 
        { ...customization, updated_at: new Date().toISOString() } : 
        custom
      );
      
      // Update the product with the modified customizations array
      const { error: updateError } = await supabase
        .from("unified_products")
        .update({ customizations: toJsonValue(updatedCustomizations) })
        .eq("id", productId);
        
      if (updateError) {
        throw updateError;
      }
      
      return customization;
    } catch (error: any) {
      toast.error(`Erreur lors de la mise à jour de la personnalisation: ${error.message}`);
      return null;
    }
  },

  async deleteCustomization(customizationId: string, productId: string): Promise<boolean> {
    try {
      // Get the current product with its customizations
      const { data: product, error: fetchError } = await supabase
        .from("unified_products")
        .select("customizations")
        .eq("id", productId)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Parse and filter out the customization to delete
      const currentCustomizations = parseCustomizations(product.customizations);
      const updatedCustomizations = currentCustomizations.filter(
        (custom: Customization) => custom.id !== customizationId
      );
      
      // Update the product with the filtered customizations array
      const { error: updateError } = await supabase
        .from("unified_products")
        .update({ customizations: toJsonValue(updatedCustomizations) })
        .eq("id", productId);
        
      if (updateError) {
        throw updateError;
      }
      
      return true;
    } catch (error: any) {
      toast.error(`Erreur lors de la suppression de la personnalisation: ${error.message}`);
      return false;
    }
  }
};
