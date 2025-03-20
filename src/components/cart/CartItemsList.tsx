
import React from "react";
import { CartItem as CartItemType } from "@/types/cart";
import CartItem from "./CartItem";

interface CartItemsListProps {
  cartItems: CartItemType[];
  selectedItems: Record<string, boolean>;
  onSelectChange: (id: string, isSelected: boolean) => void;
}

const CartItemsList = ({ cartItems, selectedItems, onSelectChange }: CartItemsListProps) => {
  return (
    <div className="divide-y">
      {cartItems.map((item) => (
        <CartItem 
          key={item.id}
          item={item}
          isSelected={!!selectedItems[item.id]}
          onSelectionChange={onSelectChange}
        />
      ))}
    </div>
  );
};

export default CartItemsList;
