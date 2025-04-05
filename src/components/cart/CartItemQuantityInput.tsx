
import React from "react";

interface CartItemQuantityInputProps {
  id: string;
  quantity: number;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CartItemQuantityInput = ({ 
  id, 
  quantity, 
  isEditing, 
  onChange 
}: CartItemQuantityInputProps) => {
  return (
    <div className="flex items-center sm:mr-8">
      <label htmlFor={`quantity-${id}`} className="sr-only">Quantité</label>
      <input
        id={`quantity-${id}`}
        type="number"
        min="1"
        value={quantity}
        onChange={onChange}
        disabled={isEditing}
        className="w-16 p-1 text-center border border-gray-300 rounded"
      />
    </div>
  );
};

export default CartItemQuantityInput;
