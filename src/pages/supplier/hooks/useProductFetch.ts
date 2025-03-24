
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
        original_price: typedProduct.original_price || null,
        category: typedProduct.category,
        subcategory: typedProduct.subcategory || null,
        description: typedProduct.description || null,
        image: typedProduct.image || null,
        status: typedProduct.status as 'draft' | 'published' | 'archived',
        is_customizable: typedProduct.is_customizable || false,
        // Champs de variantes
        size: typedProduct.size || null,
        color: typedProduct.color || null,
        hex_color: typedProduct.hex_color || null,
        stock: typedProduct.stock || 0,
        price_adjustment: typedProduct.customization_price_adjustment || 0,
        variant_status: typedProduct.variant_status as 'in_stock' | 'low_stock' | 'out_of_stock' || 'in_stock',
        bat: typedProduct.bat || null,
        poids: typedProduct.poids || null,
        format: typedProduct.format || null,
        quantite: typedProduct.quantite || null,
        echantillon: typedProduct.echantillon || null,
        types_impression: typedProduct.types_impression || null,
        type_de_materiaux: typedProduct.type_de_materiaux || null,
        details_impression: typedProduct.details_impression || null,
        orientation_impression: typedProduct.orientation_impression || null,
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
