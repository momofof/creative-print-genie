
import React, { useState } from "react";
import { CartItem as CartItemType } from "@/types/product";
import CartItemImage from "./CartItemImage";
import CartItemInfo from "./CartItemInfo";
import CartItemPrice from "./CartItemPrice";
import CartItemActions from "./CartItemActions";
import CartItemQuantityInput from "./CartItemQuantityInput";
import CartItemEditButton from "./CartItemEditButton";

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  onEdit: () => void;
}

const CartItem = ({ item, updateQuantity, removeItem, onEdit }: CartItemProps) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(item.name);
  const [editedPrice, setEditedPrice] = useState(item.price);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (newQuantity > 0) {
      setQuantity(newQuantity);
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeItem(item.id);
  };
  
  const handleEditInline = () => {
    setIsEditing(true);
  };
  
  const handleSave = () => {
    if (editedName.trim() === '' || editedPrice <= 0) {
      return;
    }
    
    setIsLoading(true);
    
    // Call the editCartItem function if provided
    // Note: This is for inline editing of name/price, not full product edit
    
    setIsLoading(false);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    // Reset to original values
    setEditedName(item.name);
    setEditedPrice(item.price);
    setQuantity(item.quantity);
    setIsEditing(false);
  };

  return (
    <div className="p-4 flex flex-col sm:flex-row sm:items-center">
      <CartItemImage 
        image={item.image || "/placeholder.svg"} 
        name={item.name}
      />
      
      <CartItemInfo 
        id={item.id}
        name={item.name}
        variants={item.variants}
        supplier_id={item.supplier_id}
        isEditing={isEditing}
        editedName={editedName}
        setEditedName={setEditedName}
      />
      
      <div className="flex items-center justify-between mt-3 sm:mt-0 sm:ml-4 sm:w-auto">
        <CartItemQuantityInput 
          id={item.id}
          quantity={quantity}
          isEditing={isEditing}
          onChange={handleQuantityChange}
        />
        
        <div className="flex flex-col items-end sm:w-24">
          <CartItemPrice 
            price={item.price}
            quantity={item.quantity}
            isEditing={isEditing}
            editedPrice={editedPrice}
            setEditedPrice={setEditedPrice}
          />
          
          <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-2">
            <CartItemEditButton onEdit={onEdit} />
            
            <CartItemActions 
              isEditing={isEditing}
              isLoading={isLoading}
              hasEditFunction={false}
              onEdit={handleEditInline}
              onSave={handleSave}
              onCancel={handleCancel}
              onRemove={handleRemove}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
