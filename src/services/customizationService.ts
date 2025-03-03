
import { supabase } from "@/integrations/supabase/client";
import { Customization } from "@/types/dashboard";

export const fetchCustomizations = async (supplierId: string): Promise<Customization[]> => {
  const { data, error } = await supabase
    .from('customizations')
    .select('*')
    .eq('supplier_id', supplierId);

  if (error) {
    console.error("Erreur lors de la récupération des personnalisations:", error);
    throw error;
  }

  return data || [];
};

export const createCustomization = async (customization: Omit<Customization, "id" | "created_at">): Promise<Customization> => {
  const { data, error } = await supabase
    .from('customizations')
    .insert(customization)
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la création de la personnalisation:", error);
    throw error;
  }

  return data;
};

export const updateCustomization = async (id: string, updates: Partial<Customization>): Promise<Customization> => {
  const { data, error } = await supabase
    .from('customizations')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la mise à jour de la personnalisation:", error);
    throw error;
  }

  return data;
};

export const deleteCustomization = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('customizations')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Erreur lors de la suppression de la personnalisation:", error);
    throw error;
  }
};
