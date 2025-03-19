
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";

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
  resetForm: () => void;
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
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          setUserId(data.session.user.id);
        } else {
          setUserId(null);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setUserId(null);
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
      // Réinitialiser les variantes à chaque changement de produit
      setVariants({});
    }
  }, [selectedProduct]);

  // Reset form function to clear all selections
  const resetForm = () => {
    setSelectedProduct(undefined);
    setSelectedQuantity(null);
    setVariants({});
    setAvailableVariants([]);
    setOpenIllustration(false);
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
    setOpenIllustration,
    resetForm
  };
};
