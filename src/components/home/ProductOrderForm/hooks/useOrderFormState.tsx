
import { useState } from "react";
import { Product } from "@/types/product";
import { useAuth as useSupabaseAuth } from "@/integrations/supabase/auth-helpers-react";

export const useOrderFormState = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
  const [variants, setVariants] = useState<Record<string, string>>({});
  const [availableVariants, setAvailableVariants] = useState<string[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [openIllustration, setOpenIllustration] = useState(false);
  
  // Récupérer l'ID utilisateur de Supabase Auth s'il y en a un
  const { data: { user } } = useSupabaseAuth();
  const userId = user?.id || null;

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
