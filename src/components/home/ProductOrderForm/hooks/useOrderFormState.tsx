
import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import { Product, CartItem } from "@/types/product";

export const useOrderFormState = (
  initialProduct?: Product, 
  initialQuantity: number = 1,
  initialVariants: Record<string, string> = {}
) => {
  // Product selection state
  const { products, isLoading: loadingProducts } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(initialProduct);
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(initialQuantity);
  const [variants, setVariants] = useState<Record<string, string>>(initialVariants);
  
  // UI state
  const [availableVariants, setAvailableVariants] = useState<string[]>([]);
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);
  const [summaryItems, setSummaryItems] = useState<CartItem[]>([]);
  const [summaryTotal, setSummaryTotal] = useState(0);
  
  // Set initial product if provided and not already set
  useEffect(() => {
    if (initialProduct && !selectedProduct) {
      setSelectedProduct(initialProduct);
    }
  }, [initialProduct, selectedProduct]);
  
  const handleOrderSuccess = () => {
    // Reset form state
    setSelectedProduct(undefined);
    setSelectedQuantity(null);
    setVariants({});
  };

  return {
    products,
    loadingProducts,
    selectedProduct, 
    setSelectedProduct,
    selectedQuantity, 
    setSelectedQuantity,
    variants, 
    setVariants,
    availableVariants, 
    setAvailableVariants,
    orderSummaryOpen, 
    setOrderSummaryOpen,
    summaryItems, 
    setSummaryItems,
    summaryTotal, 
    setSummaryTotal,
    handleOrderSuccess
  };
};
