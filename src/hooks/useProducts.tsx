
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/dashboard";
import { toast } from "sonner";
import { parseProductVariants, parseCustomizations } from "@/utils/jsonUtils";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // S'abonner aux mises à jour en temps réel des produits
  useEffect(() => {
    // Fonction pour formater un produit brut en produit typé
    const formatProduct = (rawProduct: any): Product => {
      return {
        ...rawProduct,
        status: (rawProduct.status === 'draft' || rawProduct.status === 'published' || rawProduct.status === 'archived') 
          ? rawProduct.status 
          : 'draft',
        variants: parseProductVariants(rawProduct.variants),
        customizations: parseCustomizations(rawProduct.customizations),
      };
    };

    // S'abonner aux événements de la table products_master
    const channel = supabase
      .channel('product-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Écouter tous les événements (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'products_master'
        },
        (payload) => {
          console.log('Changement de produit détecté:', payload);
          
          // Gérer les différents types d'événements
          if (payload.eventType === 'INSERT') {
            // Ajouter le nouveau produit à la liste
            const newProduct = formatProduct(payload.new);
            setProducts(currentProducts => [newProduct, ...currentProducts]);
            toast.success("Nouveau produit ajouté");
          } 
          else if (payload.eventType === 'UPDATE') {
            // Mettre à jour le produit existant
            const updatedProduct = formatProduct(payload.new);
            setProducts(currentProducts => 
              currentProducts.map(product => 
                product.id === updatedProduct.id ? updatedProduct : product
              )
            );
            toast.success("Produit mis à jour");
          } 
          else if (payload.eventType === 'DELETE') {
            // Supprimer le produit de la liste
            setProducts(currentProducts => 
              currentProducts.filter(product => product.id !== payload.old.id)
            );
            toast.success("Produit supprimé");
          }
        }
      )
      .subscribe();

    // Nettoyer l'abonnement lors du démontage du composant
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products_master')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error("Erreur lors de la récupération des produits:", error);
        toast.error("Impossible de charger les produits");
        return [];
      } else {
        // Convert products from unified format to our interface format
        const formattedProducts: Product[] = data.map(product => {
          return {
            ...product,
            // Ensure status is one of the expected values
            status: (product.status === 'draft' || product.status === 'published' || product.status === 'archived') 
              ? product.status 
              : 'draft',
            // Parse variants and customizations
            variants: parseProductVariants(product.variants),
            customizations: parseCustomizations(product.customizations),
          };
        });
        
        // Update products state
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
      
      // Delete the product from the master table
      const { error } = await supabase
        .from('products_master')
        .delete()
        .eq('id', productId);
        
      if (error) {
        console.error("Erreur lors de la suppression:", error);
        toast.error("Impossible de supprimer le produit");
        return false;
      } else {
        // La mise à jour de l'état se fera automatiquement via le canal realtime
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
