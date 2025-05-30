
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useCheckout } from "@/hooks/useCheckout";
import OrderSuccessDialog from "@/components/cart/OrderSuccessDialog";
import CartItemsList from "@/components/cart/CartItemsList";
import CartSummary from "@/components/cart/CartSummary";
import EmptyCart from "@/components/cart/EmptyCart";
import LoginDialog from "@/components/cart/LoginDialog";
import CartLoading from "@/components/cart/CartLoading";

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
  const { isLoggedIn } = useAuth();
  const {
    isProcessingPayment,
    loginDialogOpen,
    setLoginDialogOpen,
    handleDepositCheckout,
    handleLogin
  } = useCheckout();
  const [clearCartDialogOpen, setClearCartDialogOpen] = useState(false);
  const [orderSuccessDialogOpen, setOrderSuccessDialogOpen] = useState(false);
  
  // Force cart reload when component mounts to ensure latest state
  useEffect(() => {
    loadCart();
  }, [isLoggedIn]);
  
  const handleClearCart = () => {
    clearCart();
    setClearCartDialogOpen(false);
  };

  // Handle checkout for cart items (convert to deposit format)
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }

    // For cart checkout, we'll need to convert cart items to a deposit format
    // This is a simplified approach - you might want to handle multiple items differently
    const firstItem = cartItems[0];
    const depositData = {
      sellerUsername: firstItem.supplier_id || 'vendeur_inconnu',
      sellerName: 'Vendeur', // You might want to fetch this from supplier data
      productName: firstItem.name,
      productDescription: `Commande de ${cartItems.length} article(s)`,
      productLink: '',
      amount: totalPrice,
      estimatedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
    };

    await handleDepositCheckout(depositData);
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
