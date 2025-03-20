
import React from 'react';

interface CartItemVariantsProps {
  variants?: Record<string, string>;
}

const CartItemVariants = ({ variants }: CartItemVariantsProps) => {
  if (!variants || Object.keys(variants).length === 0) {
    return null;
  }

  return (
    <div className="text-sm text-gray-600 mt-1">
      {Object.entries(variants).map(([key, value]) => (
        <span key={key} className="mr-2">
          {key}: {value}
        </span>
      ))}
    </div>
  );
};

export default CartItemVariants;
