
import { useState, useEffect, useCallback } from "react";
import { Product } from "@/types/product";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";

interface UseOrderFormStateResult {
  selectedProduct: Product | undefined;
  setSelectedProduct: (product: Product | undefined) => void;
  selectedQuantity: number | null;
  setSelectedQuantity: (quantity: number | null) => void;
  variants: Record<string, string>;
  setVariants: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  availableVariants: string[];
  setAvailableVariants: React.Dispatch<React.SetStateAction<string[]>>;
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
  const isMobile = useIsMobile();
  const { userId } = useAuth();

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
    }
  }, [selectedProduct]);

  // Function to reset all form state - implemented as useCallback to avoid recreation
  const resetForm = useCallback(() => {
    setSelectedProduct(undefined);
    setSelectedQuantity(null);
    setVariants({});
    setAvailableVariants([]);
    setOpenIllustration(false);
  }, []);

  return {
    selectedProduct,
    setSelectedProduct,
    selectedQuantity,
    setSelectedQuantity,
    variants,
    setVariants,
    availableVariants,
    setAvailableVariants,
    openIllustration,
    setOpenIllustration,
    resetForm
  };
};
