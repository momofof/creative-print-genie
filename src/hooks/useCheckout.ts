
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CartItem } from "@/types/product";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";

interface UseCheckoutReturn {
  isProcessingPayment: boolean;
  loginDialogOpen: boolean;
  setLoginDialogOpen: (open: boolean) => void;
  handleCheckout: () => Promise<void>;
  handleLogin: () => void;
}

export const useCheckout = (): UseCheckoutReturn => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const { isLoggedIn, user } = useAuth();
  const { cartItems, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      // Enregistrer que l'utilisateur essayait de passer à la caisse
      localStorage.setItem("redirectAfterLogin", "/cart");
      setLoginDialogOpen(true);
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }
    
    setIsProcessingPayment(true);
    
    try {
      // Get user information for the payment
      const { data: userData } = await supabase
        .from('users_complete')
        .select('first_name, last_name, email')
        .eq('id', user?.id)
        .single();
      
      // Call the create-payment edge function
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: {
          cartItems,
          totalPrice,
          userId: user?.id,
          firstName: userData?.first_name || '',
          lastName: userData?.last_name || '',
          email: userData?.email || user?.email || '',
          phoneNumber: '' // Phone number might not exist in users_complete table
        }
      });

      if (error) {
        console.error("Payment creation error:", error);
        toast.error("Erreur lors de l'initialisation du paiement");
        return;
      }

      if (data.success && data.paymentUrl) {
        // Redirect to CinetPay payment page
        window.location.href = data.paymentUrl;
      } else {
        toast.error("Impossible d'initialiser le paiement. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Une erreur est survenue pendant le traitement de votre commande");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return {
    isProcessingPayment,
    loginDialogOpen,
    setLoginDialogOpen,
    handleCheckout,
    handleLogin
  };
};
