
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductVariant, Customization, VariantImage } from "@/types/dashboard";
import { toast } from "sonner";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      // Récupérer les produits avec une approche relationnelle
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
        // Transforme les données en format simple
        const formattedProducts: Product[] = data.map(product => {
          return {
            id: product.id,
            name: product.name,
            price: product.price,
            original_price: product.original_price,
            category: product.category,
            subcategory: product.subcategory,
            description: product.description,
            status: (product.status === 'draft' || product.status === 'published' || product.status === 'archived') 
              ? product.status 
              : 'draft',
            image: product.image,
            supplier_id: product.supplier_id,
            is_customizable: product.is_customizable,
            stock: product.stock,
            // Conserver les attributs simples de variante directement sur le produit
            size: product.size,
            color: product.color,
            hex_color: product.hex_color,
            variant_status: product.variant_status,
            // Initialiser les tableaux vides pour les données relationnelles
            variants: [],
            customizations: [],
            variantImages: [],
            // Horodatage
            created_at: product.created_at,
            updated_at: product.updated_at
          };
        });
        
        // Mettre à jour l'état avec les produits formatés
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

  // Récupérer les variantes d'un produit spécifique
  const fetchProductVariants = async (productId: string): Promise<ProductVariant[]> => {
    try {
      // Utiliser la nouvelle table product_variants
      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productId);
      
      if (error) {
        console.error("Erreur lors de la récupération des variantes:", error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des variantes:", error);
      return [];
    }
  };

  // Récupérer les personnalisations d'un produit spécifique
  const fetchProductCustomizations = async (productId: string): Promise<Customization[]> => {
    try {
      // Utiliser la nouvelle table product_customizations
      const { data, error } = await supabase
        .from('product_customizations')
        .select('*')
        .eq('product_id', productId);
      
      if (error) {
        console.error("Erreur lors de la récupération des personnalisations:", error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des personnalisations:", error);
      return [];
    }
  };

  // Récupérer les images des variantes d'un produit
  const fetchProductVariantImages = async (productId: string): Promise<VariantImage[]> => {
    try {
      const { data, error } = await supabase
        .from('variant_images')
        .select('*')
        .eq('product_id', productId);
      
      if (error) {
        console.error("Erreur lors de la récupération des images des variantes:", error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des images des variantes:", error);
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

  // Récupérer un produit avec toutes ses données associées (variantes et personnalisations)
  const fetchProductComplete = async (productId: string) => {
    try {
      // 1. Récupérer le produit de base
      const { data: productData, error: productError } = await supabase
        .from('unified_products')
        .select('*')
        .eq('id', productId)
        .single();
      
      if (productError) {
        console.error("Erreur lors de la récupération du produit:", productError);
        toast.error("Impossible de charger les détails du produit");
        return null;
      }
      
      // 2. Récupérer les variantes du produit
      const variants = await fetchProductVariants(productId);
      
      // 3. Récupérer les personnalisations du produit
      const customizations = await fetchProductCustomizations(productId);
      
      // 4. Récupérer les images des variantes
      const variantImages = await fetchProductVariantImages(productId);
      
      // 5. Assembler les données en un seul objet produit
      const completeProduct: Product = {
        ...productData,
        variants: variants,
        customizations: customizations,
        variantImages: variantImages,
        status: (productData.status === 'draft' || productData.status === 'published' || productData.status === 'archived') 
          ? productData.status 
          : 'draft',
      };
      
      return completeProduct;
    } catch (error) {
      console.error("Erreur lors de la récupération du produit complet:", error);
      toast.error("Impossible de charger les détails du produit");
      return null;
    }
  };

  return {
    products,
    isLoading,
    fetchProducts,
    deleteProduct,
    fetchProductComplete,
    fetchProductVariants,
    fetchProductCustomizations,
    fetchProductVariantImages
  };
};
