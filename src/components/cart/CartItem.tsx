
import React, { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { CartItem as CartItemType } from '@/types/cart';
import { Product } from '@/types/product';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';

import CartItemVariants from './item/CartItemVariants';
import CartItemQuantity from './item/CartItemQuantity';
import CartItemActions from './item/CartItemActions';
import CartItemPrice from './item/CartItemPrice';
import CartItemEditModal from './item/CartItemEditModal';

interface CartItemProps {
  item: CartItemType;
  isSelected: boolean;
  onSelectionChange: (id: string, selected: boolean) => void;
}

const CartItem = ({ item, isSelected, onSelectionChange }: CartItemProps) => {
  const { updateQuantity, removeItem, editCartItem } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);
  const [editModalOpen, setEditModalOpen] = useState(false);
  
  // Create a temporary product object to pass to the ProductOrderForm
  const productForEdit: Product = {
    id: item.id,
    name: item.name,
    price: item.price,
    originalPrice: item.originalPrice,
    image: item.image || '/placeholder.svg',
    category: item.category || 'unknown',
    subcategory: item.subcategory || '',
    description: item.description || '',
    rating: 5, // Default rating
    reviewCount: 0, // Default review count
    variants: item.variants || {}
  };

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateQuantity(item.id, newQuantity);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeItem(item.id);
    toast.success("Produit retiré du panier");
  };

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleEditComplete = (newQuantity: number, newVariants: Record<string, string>) => {
    // Update the cart item with new quantity and variants
    editCartItem(item.id, newQuantity, newVariants);
    setQuantity(newQuantity);
    setEditModalOpen(false);
    toast.success("Produit modifié avec succès");
  };

  return (
    <>
      <div className="flex items-center gap-4 py-4 border-b last:border-0">
        <div className="flex-shrink-0">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelectionChange(item.id, checked === true)}
            aria-label={`Sélectionner ${item.name}`}
          />
        </div>
        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
          <img 
            src={item.image || "/placeholder.svg"} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-grow">
          <div className="flex justify-between">
            <h3 className="font-medium">{item.name}</h3>
            <div className="font-medium">
              <CartItemPrice 
                price={item.price} 
                originalPrice={item.originalPrice} 
                quantity={quantity} 
              />
            </div>
          </div>

          <CartItemVariants variants={item.variants} />

          <div className="flex items-center justify-between mt-2">
            <CartItemQuantity 
              quantity={quantity} 
              onIncrease={handleIncrease} 
              onDecrease={handleDecrease} 
            />
            <CartItemActions onEdit={handleEdit} onRemove={handleRemove} />
          </div>
        </div>
      </div>

      <CartItemEditModal 
        isOpen={editModalOpen}
        onOpenChange={setEditModalOpen}
        product={productForEdit}
        initialQuantity={quantity}
        initialVariants={item.variants || {}}
        onEditComplete={handleEditComplete}
      />
    </>
  );
};

export default CartItem;
