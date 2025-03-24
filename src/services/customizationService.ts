
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

// Fonction pour créer une nouvelle personnalisation
export const createCustomization = async (customization: Omit<Customization, "id" | "created_at">): Promise<Customization | null> => {
  try {
    // Since product_customizations doesn't exist, we'll update the product directly
    const { data: product, error: fetchError } = await supabase
      .from('products_complete')
      .select('customizations')
      .eq('id', customization.product_id)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Parse existing customizations
    let customizations = [];
    if (product.customizations) {
      customizations = typeof product.customizations === 'string' 
        ? JSON.parse(product.customizations) 
        : product.customizations;
    }
    
    // Create a new customization with ID
    const newCustomization: Customization = {
      id: uuidv4(),
      ...customization,
      created_at: new Date().toISOString()
    };
    
    // Add to array
    customizations.push(newCustomization);
    
    // Update the product
    const { error: updateError } = await supabase
      .from('products_complete')
      .update({ customizations })
      .eq('id', customization.product_id);
      
    if (updateError) throw updateError;
    
    return newCustomization;
  } catch (error) {
    console.error("Error creating customization:", error);
    return null;
  }
};

// Fonction pour récupérer toutes les personnalisations d'un produit
export const getProductCustomizations = async (productId: string): Promise<Customization[]> => {
  try {
    // Get customizations from the product
    const { data: product, error } = await supabase
      .from('products_complete')
      .select('customizations')
      .eq('id', productId)
      .single();
      
    if (error) throw error;
    
    // Parse and return customizations
    if (product && product.customizations) {
      const customizations = typeof product.customizations === 'string' 
        ? JSON.parse(product.customizations) 
        : product.customizations;
        
      return Array.isArray(customizations) ? customizations : [];
    }
    
    return [];
  } catch (error) {
    console.error("Error getting customizations:", error);
    return [];
  }
};

// Fonction pour obtenir une personnalisation spécifique
export const getCustomization = async (productId: string, customizationId: string): Promise<Customization | null> => {
  try {
    // Get customizations from the product
    const { data: product, error } = await supabase
      .from('products_complete')
      .select('customizations')
      .eq('id', productId)
      .single();
      
    if (error) throw error;
    
    // Parse customizations
    if (product && product.customizations) {
      const customizations = typeof product.customizations === 'string' 
        ? JSON.parse(product.customizations) 
        : product.customizations;
        
      // Find the specific customization
      if (Array.isArray(customizations)) {
        const customization = customizations.find(c => c.id === customizationId);
        return customization || null;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error getting customization:", error);
    return null;
  }
};

// Fonction pour mettre à jour une personnalisation
export const updateCustomization = async (productId: string, customizationId: string, updates: Partial<Customization>): Promise<boolean> => {
  try {
    // Get customizations from the product
    const { data: product, error: fetchError } = await supabase
      .from('products_complete')
      .select('customizations')
      .eq('id', productId)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Parse customizations
    if (product && product.customizations) {
      let customizations = typeof product.customizations === 'string' 
        ? JSON.parse(product.customizations) 
        : product.customizations;
        
      // Find and update the specific customization
      if (Array.isArray(customizations)) {
        customizations = customizations.map(c => {
          if (c.id === customizationId) {
            return { ...c, ...updates };
          }
          return c;
        });
        
        // Update the product
        const { error: updateError } = await supabase
          .from('products_complete')
          .update({ customizations })
          .eq('id', productId);
          
        if (updateError) throw updateError;
        
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error("Error updating customization:", error);
    return false;
  }
};

// Fonction pour supprimer une personnalisation
export const deleteCustomization = async (productId: string, customizationId: string): Promise<boolean> => {
  try {
    // Get customizations from the product
    const { data: product, error: fetchError } = await supabase
      .from('products_complete')
      .select('customizations')
      .eq('id', productId)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Parse customizations
    if (product && product.customizations) {
      let customizations = typeof product.customizations === 'string' 
        ? JSON.parse(product.customizations) 
        : product.customizations;
        
      // Filter out the customization to delete
      if (Array.isArray(customizations)) {
        customizations = customizations.filter(c => c.id !== customizationId);
        
        // Update the product
        const { error: updateError } = await supabase
          .from('products_complete')
          .update({ customizations })
          .eq('id', productId);
          
        if (updateError) throw updateError;
        
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error("Error deleting customization:", error);
    return false;
  }
};
