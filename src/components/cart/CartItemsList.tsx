
import React from "react";
import { CartItem as CartItemType } from "@/types/product";
import CartItem from "./CartItem";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { AlertTriangle, Trash2 } from "lucide-react";

interface CartItemsListProps {
  cartItems: CartItemType[];
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  editCartItem?: (itemId: string, newQuantity: number, variants?: Record<string, string>) => void;
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
  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Articles ({cartItems.length})</h2>
            
            <AlertDialog open={clearCartDialogOpen} onOpenChange={setClearCartDialogOpen}>
              <AlertDialogTrigger asChild>
                <button
                  className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <Trash2 size={16} />
                  <span>Vider le panier</span>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Vider le panier
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir vider votre panier ? Tous les articles seront supprimés.
                    Cette action ne peut pas être annulée.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleClearCart}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Vider le panier
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <div className="divide-y">
          {cartItems.map((item) => (
            <CartItem 
              key={item.id}
              item={item}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
              editCartItem={editCartItem}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartItemsList;
