
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AlertDialog } from "@/components/ui/alert-dialog";
import Navigation from "@/components/Navigation";
import { useCart } from "@/hooks/useCart";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import OrderSuccessDialog from "@/components/cart/OrderSuccessDialog";
import CartHeader from "@/components/cart/CartHeader";
import CartItemsList from "@/components/cart/CartItemsList";
import CartSummary from "@/components/cart/CartSummary";
import EmptyCart from "@/components/cart/EmptyCart";
import ClearCartDialog from "@/components/cart/ClearCartDialog";
import CartLoading from "@/components/cart/CartLoading";

const Cart = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    isLoading, 
    totalPrice, 
    removeItem, 
    clearCart 
  } = useCart();
  const { isLoggedIn } = useAuthStatus();
  const [clearCartDialogOpen, setClearCartDialogOpen] = useState(false);
  const [orderSuccessDialogOpen, setOrderSuccessDialogOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [selectAll, setSelectAll] = useState(false);
  
  const handleClearCart = () => {
    clearCart();
    setClearCartDialogOpen(false);
    setSelectedItems({});
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      toast.info("Veuillez vous connecter pour passer une commande");
      navigate("/login");
      return;
    }
    
    setOrderSuccessDialogOpen(true);
    toast.success("Votre commande a été traitée avec succès!");
  };
  
  const handleSelectItem = (id: string, isSelected: boolean) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: isSelected
    }));
  };
  
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    const newSelectedItems: Record<string, boolean> = {};
    
    if (checked) {
      cartItems.forEach(item => {
        newSelectedItems[item.id] = true;
      });
    }
    
    setSelectedItems(newSelectedItems);
  };
  
  const handleDeleteSelected = () => {
    const itemsToDelete = Object.entries(selectedItems)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);
    
    if (itemsToDelete.length === 0) {
      toast.error("Veuillez sélectionner au moins un article à supprimer");
      return;
    }
    
    itemsToDelete.forEach(id => removeItem(id));
    setSelectedItems({});
    toast.success(`${itemsToDelete.length} article(s) supprimé(s) du panier`);
  };
  
  // Check if any item is selected for the delete button state
  const anyItemSelected = Object.values(selectedItems).some(selected => selected);
  
  useEffect(() => {
    if (cartItems.length === 0) {
      setSelectAll(false);
      setSelectedItems({});
      return;
    }
    
    const allSelected = cartItems.every(item => selectedItems[item.id]);
    setSelectAll(allSelected);
  }, [cartItems, selectedItems]);

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
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <CartHeader 
                  cartItemsCount={cartItems.length}
                  selectAll={selectAll}
                  handleSelectAll={handleSelectAll}
                  handleDeleteSelected={handleDeleteSelected}
                  clearCartDialogOpen={clearCartDialogOpen}
                  setClearCartDialogOpen={setClearCartDialogOpen}
                  anyItemSelected={anyItemSelected}
                />
                
                <CartItemsList 
                  cartItems={cartItems}
                  selectedItems={selectedItems}
                  onSelectChange={handleSelectItem}
                />
              </div>
            </div>
            
            <CartSummary 
              totalPrice={totalPrice}
              handleCheckout={handleCheckout}
            />
          </div>
        )}
        
        <AlertDialog open={clearCartDialogOpen} onOpenChange={setClearCartDialogOpen}>
          <ClearCartDialog onConfirm={handleClearCart} />
        </AlertDialog>
        
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
