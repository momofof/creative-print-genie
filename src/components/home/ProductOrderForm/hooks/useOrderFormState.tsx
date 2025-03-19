
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { parseVariants, extractVariantOptionsFromProduct } from "../utils";

interface UseOrderFormStateResult {
  selectedProduct: Product | undefined;
  setSelectedProduct: (product: Product | undefined) => void;
  selectedQuantity: number | null;
  setSelectedQuantity: (quantity: number | null) => void;
  variants: Record<string, string>;
  setVariants: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  availableVariants: string[];
  setAvailableVariants: React.Dispatch<React.SetStateAction<string[]>>;
  userId: string | null;
  openIllustration: boolean;
  setOpenIllustration: (open: boolean) => void;
}

export const useOrderFormState = (): UseOrderFormStateResult => {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
  const [variants, setVariants] = useState<Record<string, string>>({});
  const [availableVariants, setAvailableVariants] = useState<string[]>([]);
  const [openIllustration, setOpenIllustration] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      }
    };
    
    checkAuth();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
      } else {
        setUserId(null);
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Automatically open the illustration sheet on mobile when variants are selected
  useEffect(() => {
    if (isMobile && selectedProduct && Object.keys(variants).length > 0) {
      setOpenIllustration(true);
    }
  }, [variants, selectedProduct, isMobile]);
  
  // Reset variants when product changes
  useEffect(() => {
    if (selectedProduct) {
      // Reset variants when product changes
      setVariants({});
      
      // Extract available variants from the product if it has them
      if (selectedProduct.variants && typeof selectedProduct.variants === 'object') {
        try {
          console.log("Product has variants:", selectedProduct.variants);
          const variantTypes = extractVariantOptionsFromProduct(selectedProduct);
          console.log("Extracted variant types:", variantTypes);
          if (variantTypes.length > 0) {
            setAvailableVariants(variantTypes);
          } else {
            // Fallback to getting variants based on category if no variants in product
            const category = selectedProduct.category || '';
            console.log("Using category for variants:", category);
            const variantsFromCategory = getAvailableVariantsFromCategory(category);
            setAvailableVariants(variantsFromCategory);
          }
        } catch (error) {
          console.error("Error extracting variants from product:", error);
          // Fallback to category-based variants
          const category = selectedProduct.category || '';
          const variantsFromCategory = getAvailableVariantsFromCategory(category);
          setAvailableVariants(variantsFromCategory);
        }
      } else {
        // Use category-based variants if product doesn't have variants
        const category = selectedProduct.category || '';
        console.log("Product has no variants, using category:", category);
        const variantsFromCategory = getAvailableVariantsFromCategory(category);
        setAvailableVariants(variantsFromCategory);
      }
    }
  }, [selectedProduct]);
  
  // Helper function to get variants based on category
  const getAvailableVariantsFromCategory = (category: string): string[] => {
    // This is a placeholder - in real implementation you should import getAvailableVariants from your config
    // Return common variant types as fallback
    return ["color", "size"];
  };

  return {
    selectedProduct,
    setSelectedProduct,
    selectedQuantity,
    setSelectedQuantity,
    variants,
    setVariants,
    availableVariants,
    setAvailableVariants,
    userId,
    openIllustration,
    setOpenIllustration
  };
};
