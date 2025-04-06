
import React, { useState } from "react";
import { CartItem } from "@/types/product";
import CartItem from "./CartItem";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import RemoveItemDialog from "./RemoveItemDialog";
import EditItemModal from "./EditItemModal";
import { useProductsWithVariants } from "@/hooks/useProductsWithVariants";

interface CartItemsListProps {
  cartItems: CartItem[];
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  editCartItem: (itemId: string, newQuantity: number, variants?: Record<string, string>) => void;
  clearCart: () => void;
  clearCartDialogOpen: boolean;
  setClearCartDialogOpen: (open: boolean) => void;
  handleClearCart: () => void;
}

const CartItemsList = ({
  cartItems,
  updateQuantity,
  removeItem,
  editCartItem,
  clearCart,
  clearCartDialogOpen,
  setClearCartDialogOpen,
  handleClearCart
}: CartItemsListProps) => {
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { products, isLoading: loadingProducts } = useProductsWithVariants();

  const handleEditItem = (item: CartItem) => {
    setEditingItem(item);
    setEditModalOpen(true);
  };

  const handleEditComplete = (productId: string, quantity: number, variants: Record<string, string>) => {
    if (editingItem) {
      editCartItem(editingItem.id, quantity, variants);
      setEditModalOpen(false);
      setEditingItem(null);
    }
  };

  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Articles ({cartItems.length})</h2>
          {cartItems.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setClearCartDialogOpen(true)}
              className="text-xs"
            >
              Vider le panier
            </Button>
          )}
        </div>

        {cartItems.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <CartItem
                key={`${item.id}-${JSON.stringify(item.variants)}`}
                item={item}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
                onEdit={() => handleEditItem(item)}
              />
            ))}
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Votre panier est vide. Ajoutez des produits pour continuer.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <RemoveItemDialog
        open={clearCartDialogOpen}
        onOpenChange={setClearCartDialogOpen}
        onConfirm={handleClearCart}
        title="Vider le panier"
        description="Êtes-vous sûr de vouloir vider votre panier ? Cette action ne peut pas être annulée."
      />

      <EditItemModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        editingItem={editingItem}
        products={products}
        loadingProducts={loadingProducts}
        onEditComplete={handleEditComplete}
      />
    </div>
  );
};

export default CartItemsList;
