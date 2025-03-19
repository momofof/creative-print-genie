
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { extractVariantOptionsFromProduct } from "../utils/parsingUtils";

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
        console.log("Logged in user:", data.user.id);
        setUserId(data.user.id);
      } else {
        console.log("No user logged in");
      }
    };
    
    checkAuth();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      if (session?.user) {
        console.log("User logged in:", session.user.id);
        setUserId(session.user.id);
      } else {
        console.log("User logged out");
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
      console.log("Opening illustration on mobile with variants:", variants);
      setOpenIllustration(true);
    }
  }, [variants, selectedProduct, isMobile]);
  
  // Reset variants when product changes
  useEffect(() => {
    if (selectedProduct) {
      console.log("Product changed, resetting variants. New product:", selectedProduct.name);
      // Réinitialiser les variantes à chaque changement de produit
      setVariants({});
    }
  }, [selectedProduct]);

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
