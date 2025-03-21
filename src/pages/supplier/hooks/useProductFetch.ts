
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
      
      // Parse variants from the JSONB field
      const parsedVariants = parseVariantsFromJson(typedProduct.variants);
      setVariants(parsedVariants);
      
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
