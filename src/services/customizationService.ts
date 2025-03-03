
import { supabase } from "@/integrations/supabase/client";
import { Customization } from "@/types/dashboard";

export const fetchCustomizations = async (productId: string): Promise<Customization[]> => {
  try {
    const { data, error } = await supabase
      .from('customizations')
      .select('*')
      .eq('product_id', productId)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching customizations:", error);
    throw error;
  }
};

export const createCustomization = async (customization: Partial<Customization>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('customizations')
      .insert(customization);

    if (error) throw error;
  } catch (error) {
    console.error("Error creating customization:", error);
    throw error;
  }
};

export const updateCustomization = async (id: string, customization: Partial<Customization>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('customizations')
      .update(customization)
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating customization:", error);
    throw error;
  }
};

export const deleteCustomization = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('customizations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting customization:", error);
    throw error;
  }
};
