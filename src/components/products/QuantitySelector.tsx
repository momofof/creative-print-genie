
import React from "react";

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: (quantity: number) => void;
}

const QuantitySelector = ({ quantity, setQuantity }: QuantitySelectorProps) => {
  return (
    <div className="mb-6">
      <div className="mb-2 font-medium">Quantité</div>
      <div className="flex h-10 w-32">
        <button 
          className="w-10 h-10 border border-r-0 rounded-l flex items-center justify-center text-gray-600 hover:bg-gray-50"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
        >
          -
        </button>
        <div className="w-12 h-10 border flex items-center justify-center font-medium">
          {quantity}
        </div>
        <button 
          className="w-10 h-10 border border-l-0 rounded-r flex items-center justify-center text-gray-600 hover:bg-gray-50"
          onClick={() => setQuantity(quantity + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;
