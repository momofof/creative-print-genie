
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProductData, SupabaseProduct } from "./types/productTypes";

export const useProductFetch = (
  setProductData: React.Dispatch<React.SetStateAction<ProductData>>,
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const navigate = useNavigate();

  const fetchProductData = async (productId: string) => {
    try {
      // Fetch product data from the unified_products table
      const { data: product, error: productError } = await supabase
        .from("unified_products")
        .select("*")
        .eq("id", productId)
        .single();
      
      if (productError) throw productError;
      
      if (!product) {
        toast.error("Produit non trouvé");
        navigate("/supplier/dashboard");
        return;
      }
      
      // Convert the product to our expected type
      const typedProduct = product as unknown as SupabaseProduct;
      
      // Extract the relevant fields for our ProductData type
      const formattedProduct: ProductData = {
        name: typedProduct.name,
        price: typedProduct.price,
        original_price: typedProduct.original_price || undefined,
        category: typedProduct.category,
        subcategory: typedProduct.subcategory || "",
        description: typedProduct.description || null,
        image: typedProduct.image || null,
        status: typedProduct.status as 'draft' | 'published' | 'archived',
        is_customizable: typedProduct.is_customizable || false,
        // Champs de variantes
        size: typedProduct.size || "",
        color: typedProduct.color || "",
        hex_color: typedProduct.hex_color || "#000000",
        stock: typedProduct.stock || 0,
        price_adjustment: typedProduct.price_adjustment || 0,
        variant_status: typedProduct.variant_status as 'in_stock' | 'low_stock' | 'out_of_stock' || 'in_stock',
        bat: typedProduct.bat || "",
        poids: typedProduct.poids || "",
        format: typedProduct.format || "",
        quantite: typedProduct.quantite || "",
        echantillon: typedProduct.echantillon || "",
        types_impression: typedProduct.types_impression || "",
        type_de_materiaux: typedProduct.type_de_materiaux || "",
        details_impression: typedProduct.details_impression || "",
        orientation_impression: typedProduct.orientation_impression || "",
        // URL d'image pour variante (simplifiée)
        variant_image_url: typedProduct.variant_image_url || null
      };
      
      setProductData(formattedProduct);
      setImagePreview(typedProduct.image);
      
      setIsLoading(false);
    } catch (error: any) {
      console.error("Error fetching product:", error);
      toast.error("Erreur lors du chargement du produit");
      navigate("/supplier/dashboard");
    }
  };

  return { fetchProductData };
};
