
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProductData, SupabaseProduct } from "./types/productTypes";
import { useVariantParser } from "./useVariantParser";

export const useProductFetch = (
  setProductData: React.Dispatch<React.SetStateAction<ProductData>>,
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>,
  setVariants: React.Dispatch<React.SetStateAction<any[]>>,
  setVariantImagePreviews: React.Dispatch<React.SetStateAction<Record<string, string>>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const navigate = useNavigate();
  const { parseVariantsFromJson } = useVariantParser();

  const fetchProductData = async (productId: string) => {
    try {
      // Fetch product data from the products_master table
      const { data: product, error: productError } = await supabase
        .from("products_master")
        .select("*")
        .eq("id", productId)
        .single();
      
      if (productError) throw productError;
      
      if (!product) {
        toast.error("Produit non trouvé");
        navigate("/supplier/dashboard");
        return;
      }
      
      // Safely typecast the product to our SupabaseProduct type
      const typedProduct = product as SupabaseProduct;
      
      // Extract the relevant fields for our ProductData type
      const formattedProduct: ProductData = {
        name: typedProduct.name,
        price: typedProduct.price,
        original_price: typedProduct.original_price,
        category: typedProduct.category,
        subcategory: typedProduct.subcategory,
        description: typedProduct.description,
        image: typedProduct.image,
        variant_images: typedProduct.variant_images ? typedProduct.variant_images as Record<string, string> : null,
        status: typedProduct.status as 'draft' | 'published' | 'archived',
        is_customizable: typedProduct.is_customizable || false
      };
      
      setProductData(formattedProduct);
      setImagePreview(typedProduct.image);
      
      // Fetch variants from the product_variants table
      const { data: variantsData, error: variantsError } = await supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", productId);
      
      if (variantsError) throw variantsError;
      
      // Format the variants for our component
      const formattedVariants = variantsData.map(variant => ({
        id: variant.id.toString(),
        size: variant.size || "M",
        color: variant.color || "",
        hex_color: variant.hex_color || "#000000",
        stock: variant.stock || 0,
        price_adjustment: variant.price_adjustment || 0,
        status: variant.status || "in_stock",
        bat: variant.bat,
        poids: variant.poids,
        format: variant.format,
        quantite: variant.quantite,
        echantillon: variant.echantillon,
        types_impression: variant.types_impression,
        type_de_materiaux: variant.type_de_materiaux,
        details_impression: variant.details_impression,
        orientation_impression: variant.orientation_impression
      }));
      
      // Si aucune variante dans la table, vérifier les anciennes variantes en JSON
      if (formattedVariants.length === 0 && typedProduct.variants) {
        const parsedVariants = parseVariantsFromJson(typedProduct.variants);
        setVariants(parsedVariants);
      } else {
        setVariants(formattedVariants);
      }
      
      // Set up variant image previews if they exist
      if (typedProduct.variant_images) {
        setVariantImagePreviews(typedProduct.variant_images as Record<string, string>);
      }
      
      setIsLoading(false);
    } catch (error: any) {
      console.error("Error fetching product:", error);
      toast.error("Erreur lors du chargement du produit");
      navigate("/supplier/dashboard");
    }
  };

  return { fetchProductData };
};
