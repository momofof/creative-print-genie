
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export interface Customization {
  id: string;
  product_id: string;
  name: string;
  type: "text" | "image";
  position?: { x: number; y: number } | null;
  content?: string | null;
  created_at?: string | null;
}

// Store customizations directly as fields in the products_complete table
export const createCustomization = async (customization: Omit<Customization, "id" | "created_at">): Promise<Customization | null> => {
  try {
    // Create a new customization with ID
    const newCustomization: Customization = {
      id: uuidv4(),
      ...customization,
      created_at: new Date().toISOString()
    };
    
    // Update the product with customization fields
    const { error: updateError } = await supabase
      .from('products_complete')
      .update({ 
        customization_name: newCustomization.name,
        customization_type: newCustomization.type,
        customization_position: newCustomization.position ? JSON.stringify(newCustomization.position) : null,
        is_customizable: true
      })
      .eq('id', customization.product_id);
      
    if (updateError) throw updateError;
    
    return newCustomization;
  } catch (error) {
    console.error("Error creating customization:", error);
    return null;
  }
};

// Retrieve customizations from product fields
export const getProductCustomizations = async (productId: string): Promise<Customization[]> => {
  try {
    // Get product with customization fields
    const { data: product, error } = await supabase
      .from('products_complete')
      .select('id, customization_name, customization_type, customization_position, is_customizable')
      .eq('id', productId)
      .single();
      
    if (error) throw error;
    
    // Convert product fields to customization objects
    const customizations: Customization[] = [];
    if (product && product.is_customizable && product.customization_name) {
      customizations.push({
        id: uuidv4(), // Generate a unique ID since we don't store customization IDs
        product_id: productId,
        name: product.customization_name,
        type: (product.customization_type as "text" | "image") || "text",
        position: product.customization_position ? JSON.parse(product.customization_position) : null
      });
    }
    
    return customizations;
  } catch (error) {
    console.error("Error getting customizations:", error);
    return [];
  }
};

// Get a specific customization - since we don't have real customization IDs, we'll just use the first one
export const getCustomization = async (productId: string, customizationId: string): Promise<Customization | null> => {
  try {
    // Get product with customization fields
    const { data: product, error } = await supabase
      .from('products_complete')
      .select('id, customization_name, customization_type, customization_position, is_customizable')
      .eq('id', productId)
      .single();
      
    if (error) throw error;
    
    // Convert to a customization object
    if (product && product.is_customizable && product.customization_name) {
      return {
        id: customizationId, // Use the provided ID
        product_id: productId,
        name: product.customization_name,
        type: (product.customization_type as "text" | "image") || "text",
        position: product.customization_position ? JSON.parse(product.customization_position) : null
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error getting customization:", error);
    return null;
  }
};

// Update customization by setting product fields
export const updateCustomization = async (productId: string, customizationId: string, updates: Partial<Customization>): Promise<boolean> => {
  try {
    // Update the product with the new customization fields
    const updateFields: any = {};
    
    if (updates.name) {
      updateFields.customization_name = updates.name;
    }
    
    if (updates.type) {
      updateFields.customization_type = updates.type;
    }
    
    if (updates.position) {
      updateFields.customization_position = JSON.stringify(updates.position);
    }
    
    const { error: updateError } = await supabase
      .from('products_complete')
      .update(updateFields)
      .eq('id', productId);
      
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error("Error updating customization:", error);
    return false;
  }
};

// Delete customization by clearing product fields
export const deleteCustomization = async (productId: string, customizationId: string): Promise<boolean> => {
  try {
    // Clear the customization fields in the product
    const { error: updateError } = await supabase
      .from('products_complete')
      .update({
        customization_name: null,
        customization_type: null,
        customization_position: null,
        is_customizable: false
      })
      .eq('id', productId);
      
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error("Error deleting customization:", error);
    return false;
  }
};
