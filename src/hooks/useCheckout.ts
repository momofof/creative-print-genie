
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface DepositData {
  sellerUsername: string;
  sellerName: string;
  productName: string;
  productDescription: string;
  productLink?: string;
  amount: number;
  estimatedDeliveryDate: string;
}

interface UseDepositReturn {
  isProcessingPayment: boolean;
  loginDialogOpen: boolean;
  setLoginDialogOpen: (open: boolean) => void;
  handleDepositCheckout: (depositData: DepositData) => Promise<void>;
  handleLogin: () => void;
}

export const useCheckout = (): UseDepositReturn => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleDepositCheckout = async (depositData: DepositData) => {
    if (!isLoggedIn) {
      localStorage.setItem("redirectAfterLogin", "/dashboard");
      setLoginDialogOpen(true);
      return;
    }

    if (!depositData.amount || depositData.amount <= 0) {
      toast.error("Montant invalide");
      return;
    }
    
    setIsProcessingPayment(true);
    
    try {
      // Get user information for the payment
      const { data: userData, error: userError } = await supabase
        .from('users_complete')
        .select('first_name, last_name, email')
        .eq('id', user?.id)
        .maybeSingle();
      
      if (userError) {
        console.error("Error fetching user data:", userError);
      }

      // Use available user data or fallback values
      const firstName = userData?.first_name || 'Utilisateur';
      const lastName = userData?.last_name || '';
      const userEmail = userData?.email || user?.email || 'user@example.com';
      
      // Calculate fees (2.5%)
      const applicationFee = depositData.amount * 0.025;
      const totalAmount = depositData.amount + applicationFee;
      
      // Create a cart-like structure for the payment system
      const cartItems = [{
        id: 'deposit',
        name: `Dépôt sécurisé - ${depositData.productName}`,
        price: totalAmount,
        quantity: 1,
        image: '/placeholder.svg',
        variants: {
          seller: depositData.sellerUsername,
          type: 'secure_deposit'
        }
      }];

      console.log("Calling create-payment with:", {
        cartItems,
        totalPrice: totalAmount,
        userId: user?.id,
        firstName,
        lastName,
        email: userEmail,
        phoneNumber: '0000000000', // Default phone number
        depositData
      });
      
      // Call the create-payment edge function
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: {
          cartItems,
          totalPrice: totalAmount,
          userId: user?.id,
          firstName,
          lastName,
          email: userEmail,
          phoneNumber: '0000000000', // Provide default phone number
          depositData: depositData // Include deposit specific data
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
        console.error("Payment creation failed:", data);
        toast.error("Impossible d'initialiser le paiement. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Une erreur est survenue pendant le traitement de votre dépôt");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return {
    isProcessingPayment,
    loginDialogOpen,
    setLoginDialogOpen,
    handleDepositCheckout,
    handleLogin
  };
};
