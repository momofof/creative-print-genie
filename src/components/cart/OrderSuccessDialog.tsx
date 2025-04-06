
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CartItem } from "@/types/product";
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
  totalPrice 
}: OrderSuccessDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Commande réussie!</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-center mb-4">
            Votre commande a été traitée avec succès. Vous recevrez un email de confirmation.
          </p>
          
          <OrderItemList cartItems={cartItems} />
          
          <div className="text-lg font-medium flex justify-between mt-4 pt-2 border-t">
            <span>Total</span>
            <span>{totalPrice.toLocaleString('fr-FR')} FCFA</span>
          </div>
        </div>
        
        <OrderDialogFooter onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
};

export default OrderSuccessDialog;
