
import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface CartItemQuantityProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const CartItemQuantity = ({ quantity, onIncrease, onDecrease }: CartItemQuantityProps) => {
  return (
    <div className="flex items-center space-x-3">
      <button 
        onClick={onDecrease}
        className="w-7 h-7 rounded-full border flex items-center justify-center text-gray-600 hover:bg-gray-100"
        aria-label="Diminuer la quantité"
      >
        <Minus size={14} />
      </button>
      <span className="w-6 text-center">{quantity}</span>
      <button 
        onClick={onIncrease}
        className="w-7 h-7 rounded-full border flex items-center justify-center text-gray-600 hover:bg-gray-100"
        aria-label="Augmenter la quantité"
      >
        <Plus size={14} />
      </button>
    </div>
  );
};

export default CartItemQuantity;
