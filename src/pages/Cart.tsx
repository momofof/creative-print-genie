
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import OrderSuccessDialog from "@/components/cart/OrderSuccessDialog";
import CartItemsList from "@/components/cart/CartItemsList";
import CartSummary from "@/components/cart/CartSummary";
import EmptyCart from "@/components/cart/EmptyCart";
import LoginDialog from "@/components/cart/LoginDialog";
import CartLoading from "@/components/cart/CartLoading";
import { supabase } from "@/integrations/supabase/client";

const Cart = () => {
  const { 
    cartItems, 
    isLoading, 
    totalPrice, 
    updateQuantity, 
    removeItem, 
    clearCart,
    editCartItem,
    loadCart
  } = useCart();
  const { isLoggedIn, user } = useAuth();
  const [clearCartDialogOpen, setClearCartDialogOpen] = useState(false);
  const [orderSuccessDialogOpen, setOrderSuccessDialogOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const navigate = useNavigate();
  
  // Force cart reload when component mounts to ensure latest state
  useEffect(() => {
    loadCart();
  }, [isLoggedIn]);
  
  const handleClearCart = () => {
    clearCart();
    setClearCartDialogOpen(false);
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

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <Navigation />
      <main className="container mx-auto px-4 py-24 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Votre Panier</h1>
        
        {isLoading ? (
          <CartLoading />
        ) : cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <CartItemsList 
              cartItems={cartItems}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
              editCartItem={editCartItem}
              clearCart={clearCart}
              clearCartDialogOpen={clearCartDialogOpen}
              setClearCartDialogOpen={setClearCartDialogOpen}
              handleClearCart={handleClearCart}
            />
            
            <CartSummary 
              totalPrice={totalPrice}
              isProcessingPayment={isProcessingPayment}
              handleCheckout={handleCheckout}
            />
          </div>
        )}
        
        <LoginDialog 
          open={loginDialogOpen} 
          onOpenChange={setLoginDialogOpen} 
          onLogin={handleLogin} 
        />
        
        <OrderSuccessDialog
          open={orderSuccessDialogOpen}
          onOpenChange={setOrderSuccessDialogOpen}
          cartItems={cartItems}
          totalPrice={totalPrice}
        />
      </main>
    </>
  );
};

export default Cart;
