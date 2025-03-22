
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/dashboard";
import { toast } from "sonner";
import { parseCustomizations } from "@/utils/jsonUtils";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('unified_products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error("Erreur lors de la récupération des produits:", error);
        toast.error("Impossible de charger les produits");
        return [];
      } else {
        // Convertir les produits unifiés en notre format d'interface
        const formattedProducts: Product[] = data.map(product => {
          return {
            ...product,
            // S'assurer que le statut est une valeur attendue
            status: (product.status === 'draft' || product.status === 'published' || product.status === 'archived') 
              ? product.status 
              : 'draft',
            // Ensure variants and customizations are parsed from JSON
            variants: product.variants || [],
            customizations: product.customizations || [],
          };
        });
        
        // Mettre à jour l'état des produits
        setProducts(formattedProducts);
        setIsLoading(false);
        return formattedProducts;
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue");
      setIsLoading(false);
      return [];
    }
  };

  // Delete a product
  const deleteProduct = async (productId: string) => {
    try {
      // Display confirmation
      if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
        return false;
      }
      
      // Delete the product from the unified table
      const { error } = await supabase
        .from('unified_products')
        .delete()
        .eq('id', productId);
        
      if (error) {
        console.error("Erreur lors de la suppression:", error);
        toast.error("Impossible de supprimer le produit");
        return false;
      } else {
        // Update products list
        setProducts(products.filter(product => product.id !== productId));
        toast.success("Produit supprimé avec succès");
        return true;
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue");
      return false;
    }
  };

  return {
    products,
    isLoading,
    fetchProducts,
    deleteProduct
  };
};
