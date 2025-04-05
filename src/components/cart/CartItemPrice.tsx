
import React from "react";

interface CartItemPriceProps {
  price: number;
  quantity: number;
  isEditing: boolean;
  editedPrice: number;
  setEditedPrice: (price: number) => void;
}

const CartItemPrice = ({ 
  price, 
  quantity, 
  isEditing, 
  editedPrice, 
  setEditedPrice 
}: CartItemPriceProps) => {
  return (
    <div className="flex flex-col items-end sm:w-24">
      {isEditing ? (
        <input
          type="number"
          step="0.01"
          min="0"
          value={editedPrice}
          onChange={(e) => setEditedPrice(parseFloat(e.target.value))}
          className="w-24 p-1 border border-gray-300 rounded"
        />
      ) : (
        <span className="font-bold text-gray-900">
          {(price * quantity).toLocaleString('fr-FR')} FCFA
        </span>
      )}
    </div>
  );
};

export default CartItemPrice;
