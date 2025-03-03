
import { supabase } from "@/integrations/supabase/client";
import { Customization, CustomerCustomization } from "@/types/dashboard";
import { toast } from "sonner";

export const getCustomizationsForProduct = async (productId: string): Promise<Customization[]> => {
  try {
    const { data, error } = await supabase
      .from('customizations')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching customizations:", error);
      return [];
    }
    
    return data as Customization[];
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

export const addCustomization = async (customizationData: Customization): Promise<Customization | null> => {
  try {
    // Ensure required fields are present for Supabase
    if (!customizationData.name || !customizationData.product_id || !customizationData.type) {
      toast.error("Missing required fields for customization");
      return null;
    }
    
    const { data, error } = await supabase
      .from('customizations')
      .insert(customizationData)
      .select();

    if (error) {
      console.error("Error adding customization:", error);
      toast.error("Failed to add customization");
      return null;
    }

    toast.success("Customization added successfully");
    return data[0] as Customization;
  } catch (error) {
    console.error("Error:", error);
    toast.error("An error occurred");
    return null;
  }
};

export const updateCustomization = async (id: string, customizationData: Partial<Customization>): Promise<Customization | null> => {
  try {
    const { data, error } = await supabase
      .from('customizations')
      .update(customizationData)
      .eq('id', id)
      .select();

    if (error) {
      console.error("Error updating customization:", error);
      toast.error("Failed to update customization");
      return null;
    }

    toast.success("Customization updated successfully");
    return data[0] as Customization;
  } catch (error) {
    console.error("Error:", error);
    toast.error("An error occurred");
    return null;
  }
};

export const deleteCustomization = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('customizations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting customization:", error);
      toast.error("Failed to delete customization");
      return false;
    }

    toast.success("Customization deleted successfully");
    return true;
  } catch (error) {
    console.error("Error:", error);
    toast.error("An error occurred");
    return false;
  }
};

export const getCustomerCustomizations = async (customizationId: string): Promise<CustomerCustomization[]> => {
  try {
    const { data, error } = await supabase
      .from('customer_customizations')
      .select('*')
      .eq('customization_id', customizationId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching customer customizations:", error);
      return [];
    }
    
    return data as CustomerCustomization[];
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};
