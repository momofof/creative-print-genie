
import React from 'react';

interface CartItemPriceProps {
  price: number;
  originalPrice?: number;
  quantity: number;
}

const CartItemPrice = ({ price, originalPrice, quantity }: CartItemPriceProps) => {
  const hasDiscount = originalPrice && originalPrice > price;

  if (hasDiscount) {
    return (
      <div className="flex flex-col items-end">
        <span className="text-red-600">{(price * quantity).toLocaleString('fr-FR')} €</span>
        <span className="text-gray-500 line-through text-sm">
          {(originalPrice * quantity).toLocaleString('fr-FR')} €
        </span>
      </div>
    );
  }

  return <span>{(price * quantity).toLocaleString('fr-FR')} €</span>;
};

export default CartItemPrice;
