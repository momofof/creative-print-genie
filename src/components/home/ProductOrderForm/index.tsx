
import { useState, useEffect } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"; // Use correct imports
import { Product } from "@/types/product";
import { orderService } from "@/services/orderService";
import { toast } from "sonner";
import { useOrderSubmission } from "./hooks/useOrderSubmission";
import { useOrderFormState } from "./hooks/useOrderFormState";
import OrderForm from "./OrderForm";

interface ProductOrderFormProps {
  initialProduct?: Product;
  initialQuantity?: number;
  initialVariants?: Record<string, string>;
  onEditComplete?: (quantity: number, variants: Record<string, string>) => void;
  isEditMode?: boolean;
}

const ProductOrderForm = ({
  initialProduct,
  initialQuantity = 1,
  initialVariants = {},
  onEditComplete,
  isEditMode = false
}: ProductOrderFormProps) => {
  const { 
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
  } = useOrderFormState(initialProduct, initialQuantity, initialVariants);
  
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const userId = user?.id || null;
  
  const { handleSubmit, isSubmitting } = useOrderSubmission({
    selectedProduct,
    selectedQuantity,
    variants,
    userId,
    onOrderSuccess: handleOrderSuccess,
    onShowOrderSummary: (items, total) => {
      setSummaryItems(items);
      setSummaryTotal(total);
      setOrderSummaryOpen(true);
    }
  });
  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditMode && onEditComplete) {
      // In edit mode, just return the updated values
      onEditComplete(selectedQuantity || 1, variants);
    } else {
      // In normal mode, submit the order
      await handleSubmit(e);
    }
  };
  
  return (
    <OrderForm
      products={products}
      loadingProducts={loadingProducts}
      selectedProduct={selectedProduct}
      setSelectedProduct={setSelectedProduct}
      selectedQuantity={selectedQuantity}
      setSelectedQuantity={setSelectedQuantity}
      variants={variants}
      setVariants={setVariants}
      availableVariants={availableVariants}
      setAvailableVariants={setAvailableVariants}
      handleSubmit={handleFormSubmit}
      isSubmitting={isSubmitting}
      orderSummaryOpen={orderSummaryOpen}
      setOrderSummaryOpen={setOrderSummaryOpen}
      summaryItems={summaryItems}
      summaryTotal={summaryTotal}
      isEditMode={isEditMode}
    />
  );
};

export default ProductOrderForm;
