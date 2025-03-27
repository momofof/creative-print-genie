
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductVariant } from "@/types/product";
import { toast } from "sonner";
import { allProducts } from "@/data";

// S'assurer que les produits mockés ont des variants
const ensureProductVariants = (products: any[]): Product[] => {
  return products.map(product => ({
    ...product,
    variants: Array.isArray(product.variants) ? product.variants : []
  }));
};

// Fetch products from Supabase
export const fetchProductsWithVariants = async (): Promise<Product[]> => {
  try {
    console.log("Fetching products from database...");
    
    // Fetch all products from products_complete table
    const { data: productsData, error: productsError } = await supabase
      .from('products_complete')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (productsError) {
      console.error("Error fetching products:", productsError);
      throw new Error("Failed to fetch products");
    }
    
    // Si aucun produit n'est trouvé dans la base de données, utiliser les produits mockés
    if (!productsData || productsData.length === 0) {
      console.log("No products found in database, using mocked data");
      // S'assurer que les produits mockés ont le champ variants
      return ensureProductVariants(allProducts);
    }
    
    const products: Product[] = [];
    
    // Process each product
    for (const item of productsData) {
      // Create base product object
      const product: Product = {
        id: item.id,
        name: item.name,
        description: item.description || "",
        price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
        originalPrice: item.original_price ? (typeof item.original_price === 'string' ? parseFloat(item.original_price) : item.original_price) : undefined,
        category: item.category,
        subcategory: item.subcategory || "",
        image: item.image || "/placeholder.svg",
        isNew: false, // Default value
        rating: 5, // Default rating
        reviewCount: 0, // Default review count
        is_customizable: item.is_customizable || false,
        color: item.color || undefined,
        created_at: item.created_at,
        supplier_id: item.supplier_id || undefined, // Track supplier ID directly in product
        variants: []
      };
      
      // Récupérer les variantes depuis la même table si le produit a des variantes
      const { data: variantsData, error: variantsError } = await supabase
        .from('products_complete')
        .select('*')
        .eq('id', item.id);
      
      if (variantsError) {
        console.error(`Error fetching variants for product ${item.id}:`, variantsError);
      }
      
      // Si nous avons des variantes, les ajouter au produit
      if (variantsData && variantsData.length > 0) {
        product.variants = variantsData.map(variant => ({
          id: variant.id || `variant-${Math.random().toString(36).substring(2, 9)}`,
          product_id: variant.id, // Utiliser variant.id comme product_id
          size: variant.size || undefined,
          color: variant.color || undefined,
          hex_color: variant.hex_color || undefined,
          stock: typeof variant.stock === 'string' ? parseInt(variant.stock) : (variant.stock || 0),
          price_adjustment: typeof variant.customization_price_adjustment === 'string' ? 
            parseFloat(variant.customization_price_adjustment) : 
            (variant.customization_price_adjustment || 0),
          status: variant.variant_status || 'in_stock',
          bat: variant.bat || undefined,
          poids: variant.poids || undefined,
          format: variant.format || undefined,
          quantite: variant.quantite || undefined,
          echantillon: variant.echantillon || undefined,
          types_impression: variant.types_impression || undefined,
          type_de_materiaux: variant.type_de_materiaux || undefined,
          details_impression: variant.details_impression || undefined,
          orientation_impression: variant.orientation_impression || undefined,
          image_url: variant.variant_image_url || variant.image || item.image,
          created_at: variant.created_at || new Date().toISOString(),
          updated_at: variant.updated_at || new Date().toISOString()
        }));
      } else {
        // Créer une variante par défaut à partir des champs de variante du produit lui-même
        product.variants = [{
          id: `default-${item.id}`,
          product_id: item.id,
          size: item.size || undefined,
          color: item.color || undefined,
          hex_color: item.hex_color || undefined,
          stock: typeof item.stock === 'string' ? parseInt(item.stock) : (item.stock || 0),
          price_adjustment: typeof item.customization_price_adjustment === 'string' ? 
            parseFloat(item.customization_price_adjustment) : 
            (item.customization_price_adjustment || 0),
          status: item.variant_status || 'in_stock',
          bat: item.bat || undefined,
          poids: item.poids || undefined,
          format: item.format || undefined,
          quantite: item.quantite || undefined,
          echantillon: item.echantillon || undefined,
          types_impression: item.types_impression || undefined,
          type_de_materiaux: item.type_de_materiaux || undefined,
          details_impression: item.details_impression || undefined,
          orientation_impression: item.orientation_impression || undefined,
          image_url: item.variant_image_url || item.image,
          created_at: item.created_at,
          updated_at: item.updated_at
        }];
      }
      
      products.push(product);
    }
    
    // En fonction du résultat, fusionner avec les produits mockés si nécessaire
    if (products.length === 0) {
      // S'assurer que les produits mockés ont le champ variants
      return ensureProductVariants(allProducts);
    } else {
      // Fusionner avec les produits mockés pour combler les catégories manquantes
      const existingCategories = new Set(products.map(p => p.category));
      // Assurons-nous que tous les produits mockés ont des variantes
      const missingMockProducts = ensureProductVariants(
        allProducts.filter(p => !existingCategories.has(p.category))
      );
      
      return [...products, ...missingMockProducts];
    }
  } catch (error) {
    console.error("Error in fetchProductsWithVariants:", error);
    // En cas d'erreur, retourner les produits mockés
    return ensureProductVariants(allProducts);
  }
};

// Hook to use products with variants
export const useProductsWithVariants = () => {
  const {
    data: products = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["productsWithVariants"],
    queryFn: fetchProductsWithVariants,
    meta: {
      onError: (error: any) => {
        console.error("Error fetching products with variants:", error);
        toast.error("Une erreur est survenue lors du chargement des produits");
      }
    }
  });

  return { products, isLoading, error, refetch };
};
