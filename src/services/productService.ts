
import { supabase } from '@/integrations/supabase/client';
import { uploadImage } from '@/integrations/supabase/storage';
import { toast } from 'sonner';

// Types
export interface ProductInput {
  name: string;
  price: number;
  original_price?: number | null;
  category: string;
  subcategory?: string | null;
  description?: string | null;
  image?: string | null;
  status: 'draft' | 'published' | 'archived';
  is_customizable?: boolean;
  stock?: number;
}

export interface ProductVariantInput {
  size: string;
  color: string;
  hex_color: string;
  stock: number;
  price_adjustment?: number | null;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export const productService = {
  // Récupérer tous les produits (publics)
  async getPublicProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          original_price,
          category,
          subcategory,
          description,
          image,
          status,
          stock
        `)
        .eq('status', 'published');

      if (error) {
        console.error("Erreur lors de la récupération des produits:", error);
        return [];
      }

      return data;
    } catch (error) {
      console.error("Erreur inattendue:", error);
      return [];
    }
  },

  // Récupérer un produit par son ID
  async getProductById(productId: string) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          original_price,
          category,
          subcategory,
          description,
          image,
          status,
          stock,
          is_customizable,
          created_at,
          updated_at,
          supplier_id
        `)
        .eq('id', productId)
        .single();

      if (error) {
        console.error("Erreur lors de la récupération du produit:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Erreur inattendue:", error);
      return null;
    }
  },

  // Récupérer les variantes d'un produit
  async getProductVariants(productId: string) {
    try {
      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productId);

      if (error) {
        console.error("Erreur lors de la récupération des variantes:", error);
        return [];
      }

      return data;
    } catch (error) {
      console.error("Erreur inattendue:", error);
      return [];
    }
  },

  // Créer un nouveau produit
  async createProduct(product: ProductInput, imageFile?: File | null) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error("Vous devez être connecté pour créer un produit");
        return null;
      }

      // Télécharger l'image si elle est fournie
      let imageUrl = product.image;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `products/${fileName}`;
        
        imageUrl = await uploadImage('product-images', filePath, imageFile);
      }

      // Insérer le produit
      const { data, error } = await supabase
        .from('products')
        .insert({
          ...product,
          image: imageUrl,
          supplier_id: userData.user.id
        })
        .select('id')
        .single();

      if (error) {
        console.error("Erreur lors de la création du produit:", error);
        toast.error("Erreur lors de la création du produit");
        return null;
      }

      toast.success("Produit créé avec succès");
      return data.id;
    } catch (error) {
      console.error("Erreur inattendue:", error);
      toast.error("Une erreur inattendue s'est produite");
      return null;
    }
  },

  // Mettre à jour un produit existant
  async updateProduct(productId: string, product: ProductInput, imageFile?: File | null) {
    try {
      // Télécharger l'image si elle est fournie
      let imageUrl = product.image;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `products/${fileName}`;
        
        imageUrl = await uploadImage('product-images', filePath, imageFile);
      }

      // Mettre à jour le produit
      const { error } = await supabase
        .from('products')
        .update({
          ...product,
          image: imageUrl
        })
        .eq('id', productId);

      if (error) {
        console.error("Erreur lors de la mise à jour du produit:", error);
        toast.error("Erreur lors de la mise à jour du produit");
        return false;
      }

      toast.success("Produit mis à jour avec succès");
      return true;
    } catch (error) {
      console.error("Erreur inattendue:", error);
      toast.error("Une erreur inattendue s'est produite");
      return false;
    }
  },

  // Créer ou mettre à jour des variantes de produit
  async saveProductVariants(productId: string, variants: ProductVariantInput[], variantsToDelete: string[] = []) {
    try {
      // Supprimer les variantes marquées pour suppression
      if (variantsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('product_variants')
          .delete()
          .in('id', variantsToDelete);

        if (deleteError) {
          console.error("Erreur lors de la suppression des variantes:", deleteError);
        }
      }

      // Insérer les nouvelles variantes
      if (variants.length > 0) {
        const { error: insertError } = await supabase
          .from('product_variants')
          .insert(
            variants.map(variant => ({
              product_id: productId,
              ...variant
            }))
          );

        if (insertError) {
          console.error("Erreur lors de l'insertion des variantes:", insertError);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Erreur inattendue:", error);
      return false;
    }
  },

  // Supprimer un produit
  async deleteProduct(productId: string) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        console.error("Erreur lors de la suppression du produit:", error);
        toast.error("Erreur lors de la suppression du produit");
        return false;
      }

      toast.success("Produit supprimé avec succès");
      return true;
    } catch (error) {
      console.error("Erreur inattendue:", error);
      toast.error("Une erreur inattendue s'est produite");
      return false;
    }
  }
};
