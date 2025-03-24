
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Product, ProductVariant } from "@/types/product";

export const fetchProductsWithVariants = async (): Promise<Product[]> => {
  try {
    const { data: products, error } = await supabase
      .from("products_complete")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      toast.error("Erreur lors du chargement des produits");
      return [];
    }

    // Convertir les produits de la base de données en format Product
    const formattedProducts: Product[] = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description || "",
      price: parseFloat(product.price) || 0,
      originalPrice: product.original_price ? parseFloat(product.original_price) : undefined,
      category: product.category,
      subcategory: product.subcategory || undefined,
      image: product.image || "",
      status: product.status,
      isCustomizable: product.is_customizable || false,
      variants: extractVariantsFromProduct(product),
      customization: product.is_customizable ? {
        name: product.customization_name || "",
        type: (product.customization_type as "text" | "image") || "text",
        position: product.customization_position ? JSON.parse(product.customization_position) : null,
        priceAdjustment: product.customization_price_adjustment || 0
      } : undefined
    }));

    return formattedProducts;
  } catch (error) {
    console.error("Error in fetchProductsWithVariants:", error);
    toast.error("Erreur lors du chargement des produits");
    return [];
  }
};

// Fonction pour extraire les variantes d'un produit
const extractVariantsFromProduct = (product: any): ProductVariant[] => {
  // Créer un objet variante à partir des champs directs du produit
  const mainVariant: ProductVariant = {
    id: "default",
    product_id: product.id,
    size: product.size || null,
    color: product.color || null,
    hex_color: product.hex_color || null,
    stock: product.stock ? parseInt(product.stock) : 0,
    price_adjustment: product.price_adjustment ? parseFloat(product.price_adjustment) : 0,
    status: product.variant_status || "in_stock",
    image_url: product.variant_image_url || product.image || null,
    // Attributs supplémentaires
    bat: product.bat || null,
    poids: product.poids || null,
    format: product.format || null,
    quantite: product.quantite || null,
    echantillon: product.echantillon || null,
    typesImpression: product.types_impression || null,
    typeDeMateriaux: product.type_de_materiaux || null,
    detailsImpression: product.details_impression || null,
    orientationImpression: product.orientation_impression || null
  };

  return [mainVariant];
};

export const useProductsWithVariants = () => {
  const {
    data: products = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["products-with-variants"],
    queryFn: fetchProductsWithVariants,
  });

  return {
    products,
    isLoading,
    error,
    refetch
  };
};
