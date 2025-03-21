
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ProductData, ProductVariant, ProductFormState } from "./types/productTypes";
import { parseVariantsFromJson } from "./utils/productFormUtils";

export const useProductData = (productId?: string) => {
  const navigate = useNavigate();
  const isEditing = !!productId;
  
  const [state, setState] = useState<ProductFormState>({
    isLoading: true,
    isSaving: false,
    productData: {
      name: "",
      price: 0,
      original_price: null,
      category: "",
      subcategory: null,
      description: null,
      image: null,
      status: "draft",
      is_customizable: false
    },
    variants: [],
    imageFile: null,
    imagePreview: null
  });

  useEffect(() => {
    checkAuthentication();
    if (isEditing) {
      fetchProductData();
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [productId]);

  const checkAuthentication = async () => {
    const { data } = await supabase.auth.getSession();
    
    if (!data.session) {
      toast.error("Vous devez être connecté pour accéder à cette page");
      navigate("/login");
    }
  };

  const fetchProductData = async () => {
    try {
      if (!productId) return;
      
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
      
      // Parse variants from the JSONB field
      const parsedVariants = parseVariantsFromJson(product.variants);
      
      setState({
        productData: typedProduct,
        variants: parsedVariants,
        imagePreview: product.image,
        imageFile: null,
        isLoading: false,
        isSaving: false
      });
    } catch (error: any) {
      console.error("Error fetching product:", error);
      toast.error("Erreur lors du chargement du produit");
      navigate("/supplier/dashboard");
    }
  };

  return {
    ...state,
    isEditing,
    setState,
    fetchProductData
  };
};
