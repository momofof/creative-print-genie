
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductVariant } from "@/types/product";
import { toast } from "sonner";
import { parseVariantListString } from "@/components/home/ProductOrderForm/utils/variantDisplay";

// Process a variant field value to ensure it's in the correct format
const processVariantField = (value: any): string | undefined => {
  if (!value) return undefined;
  
  // Handle the special object format that sometimes comes from the database
  if (typeof value === 'object' && value !== null) {
    // Handle the special object format with _type and value properties
    if (value._type === 'undefined' && value.value === 'undefined') {
      return undefined;
    }
    // Try to convert to string if it's another type of object
    try {
      return JSON.stringify(value);
    } catch (e) {
      return undefined;
    }
  }
  
  // Handle string format
  if (typeof value === 'string') {
    return value;
  }
  
  // For other types, convert to string
  return String(value);
};

// Fetch products from Supabase
export const fetchProductsWithVariants = async (): Promise<Product[]> => {
  try {
    console.log("Fetching products from database...");
    
    // Fetch products from products_complete table
    const { data: productsData, error } = await supabase
      .from('products_complete')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products");
    }
    
    // Map database results to Product type
    const products: Product[] = productsData.map(item => {
      // Créer un objet variante par défaut à partir des champs du produit
      const defaultVariant: ProductVariant = {
        id: `default-${item.id}`,
        product_id: item.id,
        size: processVariantField(item.size),
        color: processVariantField(item.color),
        hex_color: processVariantField(item.hex_color) || undefined,
        stock: typeof item.stock === 'string' ? parseInt(item.stock) : item.stock,
        price_adjustment: 0, // Default to 0 since it doesn't exist in the table
        status: item.variant_status || 'in_stock',
        bat: processVariantField(item.bat),
        poids: processVariantField(item.poids),
        format: processVariantField(item.format),
        quantite: processVariantField(item.quantite),
        echantillon: processVariantField(item.echantillon),
        types_impression: processVariantField(item.types_impression),
        type_de_materiaux: processVariantField(item.type_de_materiaux),
        details_impression: processVariantField(item.details_impression),
        orientation_impression: processVariantField(item.orientation_impression),
        image_url: item.variant_image_url || item.image,
        created_at: item.created_at,
        updated_at: item.updated_at
      };
      
      // Créer l'objet produit
      return {
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
        color: processVariantField(item.color),
        created_at: item.created_at,
        // Traiter chaque champ de variante pour convertir les chaînes de texte au format liste
        size: processVariantField(item.size),
        format: processVariantField(item.format),
        bat: processVariantField(item.bat),
        poids: processVariantField(item.poids),
        quantite: processVariantField(item.quantite),
        echantillon: processVariantField(item.echantillon),
        types_impression: processVariantField(item.types_impression),
        type_de_materiaux: processVariantField(item.type_de_materiaux),
        details_impression: processVariantField(item.details_impression),
        orientation_impression: processVariantField(item.orientation_impression),
        // Toujours garantir un tableau de variantes
        variants: [defaultVariant]
      };
    });
    
    console.log(`Fetched ${products.length} products with variants`);
    return products;
  } catch (error) {
    console.error("Error in fetchProductsWithVariants:", error);
    throw error;
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
