
import { Check } from "lucide-react";
import { CartItem } from "@/types/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import OrderItemList from "./OrderItemList";
import OrderDialogFooter from "./OrderDialogFooter";

interface OrderSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: CartItem[];
  totalPrice: number;
}

const OrderSuccessDialog = ({
  open,
  onOpenChange,
  cartItems,
  totalPrice,
}: OrderSuccessDialogProps) => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  
  const handleContinueShoppingClick = () => {
    // Close dialog and navigate to home page
    onOpenChange(false);
    navigate('/');
  };

  const getItemKey = (item: CartItem) => {
    return `${item.id}-${JSON.stringify(item.variants || {})}`;
  };

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
          
          <OrderItemList
            cartItems={cartItems}
            editMode={false}
            itemQuantities={{}}
            getItemKey={getItemKey}
          />
          
          <div className="mt-2 border-t pt-4">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{totalPrice.toLocaleString('fr-FR')} €</span>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
            <OrderDialogFooter
              editMode={false}
              onContinueShopping={handleContinueShoppingClick}
              onSaveChanges={() => {}}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrderSuccessDialog;
