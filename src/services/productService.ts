
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/dashboard";
import { toast } from "sonner";

// Fetch products from Supabase
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;

    if (!userId) {
      console.error("No user ID found");
      return [];
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('supplier_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des produits:", error);
      toast.error("Impossible de charger les produits");
      return [];
    } else {
      // Cast data to ensure it has all required fields including stock
      const typedProducts = data.map(product => ({
        ...product,
        stock: product.stock || 0
      })) as Product[];
      
      return typedProducts;
    }
  } catch (error) {
    console.error("Erreur:", error);
    toast.error("Une erreur est survenue");
    return [];
  }
};

// Add a new product
export const addProduct = async (productData: Partial<Product>): Promise<Product | null> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;

    if (!userId) {
      toast.error("Vous devez être connecté pour ajouter un produit");
      return null;
    }

    // Make sure required fields are present
    if (!productData.name || !productData.price || !productData.category) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return null;
    }

    // Ensure stock is present
    const completeProductData = {
      ...productData,
      supplier_id: userId,
      stock: productData.stock || 0,
      name: productData.name,
      price: productData.price,
      category: productData.category
    };

    const { data, error } = await supabase
      .from('products')
      .insert(completeProductData)
      .select();

    if (error) {
      console.error("Erreur lors de l'ajout du produit:", error);
      toast.error("Impossible d'ajouter le produit");
      return null;
    }

    toast.success("Produit ajouté avec succès");
    return data[0] as Product;
  } catch (error) {
    console.error("Erreur:", error);
    toast.error("Une erreur est survenue");
    return null;
  }
};

// Update a product
export const updateProduct = async (productId: string, productData: Partial<Product>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', productId)
      .select();

    if (error) {
      console.error("Erreur lors de la mise à jour du produit:", error);
      toast.error("Impossible de mettre à jour le produit");
      return null;
    }

    toast.success("Produit mis à jour avec succès");
    return data[0] as Product;
  } catch (error) {
    console.error("Erreur:", error);
    toast.error("Une erreur est survenue");
    return null;
  }
};

// Delete a product
export const deleteProduct = async (productId: string): Promise<boolean> => {
  try {
    // Delete the product
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
      
    if (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Impossible de supprimer le produit");
      return false;
    } else {
      toast.success("Produit supprimé avec succès");
      return true;
    }
  } catch (error) {
    console.error("Erreur:", error);
    toast.error("Une erreur est survenue");
    return false;
  }
};
