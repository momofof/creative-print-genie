
import { Check, Edit } from "lucide-react";
import { CartItem } from "@/types/product";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSupplierDashboard } from "@/hooks/useSupplierDashboard";
import OrderItemList from "./OrderItemList";
import OrderDialogFooter from "./OrderDialogFooter";
import EditItemModal from "./EditItemModal";

interface OrderSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: CartItem[];
  totalPrice: number;
  editCartItem?: (id: string, newQuantity: number, variants?: Record<string, string>) => void;
}

const OrderSuccessDialog = ({
  open,
  onOpenChange,
  cartItems,
  totalPrice,
  editCartItem,
}: OrderSuccessDialogProps) => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { products, fetchProducts } = useSupplierDashboard();
  const [loadingProducts, setLoadingProducts] = useState(false);
  
  // Initialize local quantities when items change
  useEffect(() => {
    const quantities: Record<string, number> = {};
    cartItems.forEach(item => {
      const itemKey = getItemKey(item);
      quantities[itemKey] = item.quantity;
    });
    setItemQuantities(quantities);
  }, [cartItems]);

  const handleContinueShoppingClick = () => {
    // Close dialog and navigate to home page
    onOpenChange(false);
    navigate('/');
  };

  const getItemKey = (item: CartItem) => {
    return `${item.id}-${JSON.stringify(item.variants || {})}`;
  };

  const handleQuantityChange = (item: CartItem, delta: number) => {
    const itemKey = getItemKey(item);
    const currentQuantity = itemQuantities[itemKey] || item.quantity;
    const newQuantity = Math.max(1, currentQuantity + delta);
    
    setItemQuantities(prev => ({
      ...prev,
      [itemKey]: newQuantity
    }));
  };

  const handleSaveChanges = () => {
    if (!editCartItem) {
      onOpenChange(false);
      return;
    }
    
    // Apply modifications to all items
    cartItems.forEach(item => {
      const itemKey = getItemKey(item);
      const newQuantity = itemQuantities[itemKey];
      
      if (newQuantity && newQuantity !== item.quantity) {
        editCartItem(item.id, newQuantity, item.variants);
      }
    });
    
    setEditMode(false);
    onOpenChange(false); // Close window after saving
    navigate('/cart'); // Redirect to cart to see modifications
  };

  // Calculate total based on modified quantities
  const calculateModifiedTotal = () => {
    return cartItems.reduce((sum, item) => {
      const itemKey = getItemKey(item);
      const quantity = itemQuantities[itemKey] || item.quantity;
      return sum + (item.price * quantity);
    }, 0);
  };

  const handleOpenEditModal = async (item: CartItem) => {
    // Load products if not already done
    if (products.length === 0) {
      setLoadingProducts(true);
      await fetchProducts();
      setLoadingProducts(false);
    }
    setEditingItem(item);
    setEditModalOpen(true);
  };

  const handleEditComplete = (productId: string, quantity: number, variants: Record<string, string>) => {
    if (editingItem && editCartItem) {
      editCartItem(editingItem.id, quantity, variants);
      
      // Close modal
      setEditModalOpen(false);
      setEditingItem(null);
      
      // Close main dialog and redirect to cart
      onOpenChange(false);
      navigate('/cart');
    }
  };

  const modifiedTotal = editMode ? calculateModifiedTotal() : totalPrice;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-center text-xl">Commande effectuée avec succès</DialogTitle>
            <DialogDescription className="text-center">
              Merci pour votre commande ! Voici un récapitulatif de vos articles.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-end mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 text-gray-600"
              onClick={() => setEditMode(!editMode)}
            >
              <Edit size={16} />
              <span>{editMode ? "Annuler" : "Modifier"}</span>
            </Button>
          </div>
          
          <OrderItemList
            cartItems={cartItems}
            editMode={editMode}
            itemQuantities={itemQuantities}
            onEditItem={editCartItem ? handleOpenEditModal : undefined}
            onQuantityChange={editMode ? handleQuantityChange : undefined}
            getItemKey={getItemKey}
          />
          
          <div className="mt-2 border-t pt-4">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{modifiedTotal.toLocaleString('fr-FR')} €</span>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
            <OrderDialogFooter
              editMode={editMode}
              onContinueShopping={handleContinueShoppingClick}
              onSaveChanges={handleSaveChanges}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Product edit modal */}
      <EditItemModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        editingItem={editingItem}
        products={products}
        loadingProducts={loadingProducts}
        onEditComplete={handleEditComplete}
      />
    </>
  );
};

export default OrderSuccessDialog;
