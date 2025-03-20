
import React, { useState } from 'react';
import { ArrowRight, Minus, Plus, Trash, Edit, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/hooks/useCart';
import { CartItem as CartItemType } from '@/types/cart';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ProductOrderForm from '@/components/home/ProductOrderForm';
import { Product } from '@/types/product';
import { Checkbox } from '@/components/ui/checkbox';

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

  const handleSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectionChange(item.id, e.target.checked);
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
              {item.originalPrice && item.originalPrice > item.price ? (
                <div className="flex flex-col items-end">
                  <span className="text-red-600">{(item.price * quantity).toLocaleString('fr-FR')} €</span>
                  <span className="text-gray-500 line-through text-sm">
                    {(item.originalPrice * quantity).toLocaleString('fr-FR')} €
                  </span>
                </div>
              ) : (
                <span>{(item.price * quantity).toLocaleString('fr-FR')} €</span>
              )}
            </div>
          </div>

          {/* Display variants if available */}
          {item.variants && Object.keys(item.variants).length > 0 && (
            <div className="text-sm text-gray-600 mt-1">
              {Object.entries(item.variants).map(([key, value]) => (
                <span key={key} className="mr-2">
                  {key}: {value}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleDecrease}
                className="w-7 h-7 rounded-full border flex items-center justify-center text-gray-600 hover:bg-gray-100"
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center">{quantity}</span>
              <button 
                onClick={handleIncrease}
                className="w-7 h-7 rounded-full border flex items-center justify-center text-gray-600 hover:bg-gray-100"
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={handleEdit}
                className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                aria-label="Modifier"
              >
                <Edit size={16} />
              </button>
              <button 
                onClick={handleRemove}
                className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                aria-label="Supprimer"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit product dialog */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="py-4">
            <h2 className="text-lg font-semibold mb-4">Modifier le produit</h2>
            <ProductOrderForm
              initialProduct={productForEdit}
              initialQuantity={quantity}
              initialVariants={item.variants || {}}
              onEditComplete={handleEditComplete}
              isEditMode={true}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CartItem;
