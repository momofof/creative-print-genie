
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreateProductData, ProductStatus } from "@/types/supplier";
import { Product } from "@/types/dashboard";

// Delete a product
export const deleteProduct = async (productId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);
    
    if (error) throw error;
    
    toast.success("Produit supprimé avec succès.");
    return true;
  } catch (error: any) {
    console.error("Error deleting product:", error);
    toast.error(`Erreur lors de la suppression: ${error.message}`);
    return false;
  }
};

// Create a new product
export const createProduct = async (productData: CreateProductData): Promise<string | null> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      toast.error("Vous devez être connecté pour créer un produit");
      return null;
    }

    const userId = sessionData.session.user.id;
    
    // Ensure status is one of the valid enum values
    const status = productData.status as ProductStatus || "draft";
    
    const { data, error } = await supabase
      .from('products')
      .insert({
        ...productData,
        status: status, // Use the properly typed status
        supplier_id: userId
      })
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("Produit créé avec succès!");
    return data.id;
  } catch (error: any) {
    console.error("Error creating product:", error);
    toast.error(`Erreur lors de la création du produit: ${error.message}`);
    return null;
  }
};
