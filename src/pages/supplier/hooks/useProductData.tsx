
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ProductData, ProductVariant } from "./types";
import { parseJsonArray } from "@/utils/jsonUtils";

export const useProductData = (productId?: string) => {
  const navigate = useNavigate();
  const isEditing = !!productId;
  
  const [isLoading, setIsLoading] = useState(true);
  const [productData, setProductData] = useState<ProductData>({
    name: "",
    price: 0,
    original_price: null,
    category: "",
    subcategory: null,
    description: null,
    image: null,
    status: "draft",
    is_customizable: false
  });
  
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  const fetchProductData = async () => {
    try {
      if (!productId) return false;
      
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
        return false;
      }
      
      // Extract the relevant fields for our ProductData type
      const typedProduct: ProductData = {
        name: product.name,
        price: product.price,
        original_price: product.original_price,
        category: product.category,
        subcategory: product.subcategory,
        description: product.description,
        image: product.image,
        status: product.status as 'draft' | 'published' | 'archived',
        is_customizable: product.is_customizable || false
      };
      
      setProductData(typedProduct);
      
      // Parse variants from the JSONB field
      const parsedVariants = parseJsonArray(product.variants);
      setVariants(parsedVariants);
      
      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error("Error fetching product:", error);
      toast.error("Erreur lors du chargement du produit");
      navigate("/supplier/dashboard");
      return false;
    }
  };

  return {
    isLoading,
    setIsLoading,
    productData,
    setProductData,
    variants,
    setVariants,
    isEditing,
    fetchProductData
  };
};
