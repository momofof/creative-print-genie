
import { CartItem } from "@/types/product";
import OrderItem from "./OrderItem";

interface OrderItemListProps {
  cartItems: CartItem[];
  editMode: boolean;
  itemQuantities: Record<string, number>;
  onEditItem?: (item: CartItem) => void;
  onQuantityChange?: (item: CartItem, delta: number) => void;
  getItemKey: (item: CartItem) => string;
}

const OrderItemList = ({
  cartItems,
  editMode,
  itemQuantities,
  onEditItem,
  onQuantityChange,
  getItemKey,
}: OrderItemListProps) => {
  return (
    <div className="max-h-60 overflow-y-auto py-2">
      <div className="space-y-4">
        {cartItems.map((item) => {
          const itemKey = getItemKey(item);
          const quantity = editMode 
            ? (itemQuantities[itemKey] || item.quantity) 
            : item.quantity;
          
          return (
            <OrderItem
              key={itemKey}
              item={item}
              itemKey={itemKey}
              quantity={quantity}
              editMode={editMode}
              onEditItem={onEditItem}
              onQuantityChange={onQuantityChange}
            />
          );
        })}
      </div>
    </div>
  );
};

export default OrderItemList;
