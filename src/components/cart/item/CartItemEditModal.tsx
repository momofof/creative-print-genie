
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ProductOrderForm from '@/components/home/ProductOrderForm';
import { Product } from '@/types/product';

interface CartItemEditModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  initialQuantity: number;
  initialVariants: Record<string, string>;
  onEditComplete: (quantity: number, variants: Record<string, string>) => void;
}

const CartItemEditModal = ({ 
  isOpen, 
  onOpenChange, 
  product, 
  initialQuantity, 
  initialVariants, 
  onEditComplete 
}: CartItemEditModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="py-4">
          <h2 className="text-lg font-semibold mb-4">Modifier le produit</h2>
          <ProductOrderForm
            initialProduct={product}
            initialQuantity={initialQuantity}
            initialVariants={initialVariants}
            onEditComplete={onEditComplete}
            isEditMode={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CartItemEditModal;
