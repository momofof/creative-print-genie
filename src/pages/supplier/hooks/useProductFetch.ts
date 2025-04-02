
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProductData } from "./types/productTypes";
import { ProductComplete } from "@/types/dashboard";

export const useProductFetch = (
  setProductData: React.Dispatch<React.SetStateAction<ProductData>>,
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const navigate = useNavigate();

  const fetchProductData = async (productId: string) => {
    try {
      // Fetch product data from the products_complete table
      const { data: product, error: productError } = await supabase
        .from("products_complete")
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
      const typedProduct = product as unknown as ProductComplete;
      
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
        // Options de variantes (nouveaux champs)
        size_options: typedProduct.size_options || [],
        color_options: typedProduct.color_options || [],
        format_options: typedProduct.format_options || [],
        poids_options: typedProduct.poids_options || [],
        bat_options: typedProduct.bat_options || [],
        quantite_options: typedProduct.quantite_options || [],
        echantillon_options: typedProduct.echantillon_options || [],
        types_impression_options: typedProduct.types_impression_options || [],
        type_de_materiaux_options: typedProduct.type_de_materiaux_options || [],
        details_impression_options: typedProduct.details_impression_options || [],
        orientation_impression_options: typedProduct.orientation_impression_options || [],
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
