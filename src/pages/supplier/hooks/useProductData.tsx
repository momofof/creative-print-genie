
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProductData } from "./useProductFormData";
import { ProductVariant, useProductVariants } from "./useProductVariants";

export const useProductData = (productId?: string) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { parseVariantsFromJson, setVariants } = useProductVariants([]);

  const checkAuthentication = async () => {
    const { data } = await supabase.auth.getSession();
    
    if (!data.session) {
      toast.error("Vous devez être connecté pour accéder à cette page");
      navigate("/login");
      return false;
    }
    return true;
  };

  const fetchProductData = async (
    productId: string,
    setProductData: (data: ProductData) => void, 
    setImagePreview: (url: string | null) => void
  ) => {
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
      setImagePreview(product.image);
      
      // Parse variants from the JSONB field
      const parsedVariants = parseVariantsFromJson(product.variants);
      setVariants(parsedVariants);
      
    } catch (error: any) {
      console.error("Error fetching product:", error);
      toast.error("Erreur lors du chargement du produit");
      navigate("/supplier/dashboard");
      throw error;
    }
  };

  return {
    isLoading,
    setIsLoading,
    checkAuthentication,
    fetchProductData
  };
};
