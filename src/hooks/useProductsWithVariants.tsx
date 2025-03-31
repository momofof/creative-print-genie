import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductVariant } from "@/types/product";
import { toast } from "sonner";
import { parseVariantListString } from "@/components/home/ProductOrderForm/utils";

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
      .select('*, supplier_selection_label')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products");
    }
    
    // Fetch product variants from the dedicated table
    const { data: variantsData, error: variantsError } = await supabase
      .from('product_variants')
      .select('*');
      
    if (variantsError) {
      console.error("Error fetching product variants:", variantsError);
      // Continue with default variants if we can't get the dedicated variants
    }
    
    // Fetch product suppliers from the product_suppliers table
    const { data: suppliersData, error: suppliersError } = await supabase
      .from('product_suppliers')
      .select('product_id, supplier_id, is_default, price_adjustment');
      
    if (suppliersError) {
      console.error("Error fetching product suppliers:", suppliersError);
      // Continue without suppliers information if we can't get the dedicated suppliers
    }
    
    // Group variants by product_id for easier access
    const variantsByProductId: Record<string, ProductVariant[]> = {};
    if (variantsData && variantsData.length > 0) {
      variantsData.forEach(variant => {
        if (!variantsByProductId[variant.product_id]) {
          variantsByProductId[variant.product_id] = [];
        }
        
        variantsByProductId[variant.product_id].push({
          id: variant.id,
          product_id: variant.product_id,
          size: processVariantField(variant.size),
          color: processVariantField(variant.color),
          hex_color: processVariantField(variant.hex_color),
          stock: typeof variant.stock === 'string' ? parseInt(variant.stock) : (variant.stock || 0),
          price_adjustment: typeof variant.price_adjustment === 'string' ? parseFloat(variant.price_adjustment) : (variant.price_adjustment || 0),
          status: variant.status || 'in_stock',
          bat: processVariantField(variant.bat),
          poids: processVariantField(variant.poids),
          format: processVariantField(variant.format),
          quantite: processVariantField(variant.quantite),
          echantillon: processVariantField(variant.echantillon),
          types_impression: processVariantField(variant.types_impression),
          type_de_materiaux: processVariantField(variant.type_de_materiaux),
          details_impression: processVariantField(variant.details_impression),
          orientation_impression: processVariantField(variant.orientation_impression),
          image_url: variant.image_url,
          created_at: variant.created_at,
          updated_at: variant.updated_at
        });
      });
    }
    
    // Group suppliers by product_id for easier access
    const suppliersByProductId: Record<string, { supplier_id: string, is_default: boolean, price_adjustment: number }[]> = {};
    if (suppliersData && suppliersData.length > 0) {
      suppliersData.forEach(supplier => {
        if (!suppliersByProductId[supplier.product_id]) {
          suppliersByProductId[supplier.product_id] = [];
        }
        
        suppliersByProductId[supplier.product_id].push({
          supplier_id: supplier.supplier_id,
          is_default: supplier.is_default || false,
          price_adjustment: supplier.price_adjustment || 0
        });
      });
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
      
      // Get dedicated variants for this product or use the default one
      const productVariants = variantsByProductId[item.id] || [defaultVariant];
      
      // Get suppliers for this product
      const productSuppliers = suppliersByProductId[item.id] || [];
      
      // If there are no suppliers, add the default one if available
      if (productSuppliers.length === 0 && item.supplier_id) {
        productSuppliers.push({
          supplier_id: item.supplier_id,
          is_default: true,
          price_adjustment: 0
        });
      }
      
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
        variants: productVariants,
        // Ajouter les fournisseurs
        supplier_id: item.supplier_id,
        suppliers: productSuppliers,
        // Ajouter le libellé personnalisé pour la sélection du fournisseur
        supplier_selection_label: item.supplier_selection_label || "Choisissez votre fournisseur"
      };
    });
    
    console.log(`Fetched ${products.length} products with ${
      Object.values(variantsByProductId).reduce((sum, variants) => sum + variants.length, 0)
    } total variants and ${
      Object.values(suppliersByProductId).reduce((sum, suppliers) => sum + suppliers.length, 0)
    } total suppliers`);
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
