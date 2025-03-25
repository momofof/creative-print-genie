
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";

export const useOrderFormState = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
  const [variants, setVariants] = useState<Record<string, string>>({});
  const [availableVariants, setAvailableVariants] = useState<string[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [openIllustration, setOpenIllustration] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Get the user ID from Supabase Auth
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUserId(data.session?.user?.id || null);
    };
    
    checkUser();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user?.id || null);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
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
    selectedSupplierId,
    setSelectedSupplierId,
    userId,
    openIllustration,
    setOpenIllustration
  };
};
