
import React from "react";
import { CartItem } from "@/types/product";
import { getVariantDisplayName } from "@/components/home/ProductOrderForm/utils/variantDisplay";

interface OrderItemProps {
  item: CartItem;
  itemKey?: string;
  quantity?: number;
  editMode?: boolean;
  onEditItem?: (item: CartItem) => void;
  onQuantityChange?: (item: CartItem, delta: number) => void;
}

const OrderItem: React.FC<OrderItemProps> = ({ 
  item, 
  itemKey,
  quantity = item.quantity,
  editMode = false,
  onEditItem,
  onQuantityChange
}) => {
  return (
    <div className="flex gap-4">
      <div className="shrink-0">
        <img 
          src={item.image || '/placeholder.svg'} 
          alt={item.name} 
          className="w-12 h-12 object-cover rounded-md"
        />
      </div>
      
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{item.name}</h4>
        
        <div className="mt-1 space-y-0.5 text-xs text-gray-500">
          {item.variants && Object.entries(item.variants).map(([key, value]) => (
            <div key={key} className="flex items-center gap-1">
              <span className="font-medium">{getVariantDisplayName(key)}:</span> {value}
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-right">
        <div className="font-medium text-gray-900">{item.price.toFixed(2)} €</div>
        <div className="text-xs text-gray-500">Qté: {quantity}</div>
        
        {editMode && onQuantityChange && (
          <div className="flex items-center justify-end mt-1">
            <button 
              onClick={() => onQuantityChange(item, -1)}
              className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="w-6 text-center">{quantity}</span>
            <button 
              onClick={() => onQuantityChange(item, 1)}
              className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700"
            >
              +
            </button>
          </div>
        )}
        
        {editMode && onEditItem && (
          <button 
            onClick={() => onEditItem(item)}
            className="text-xs text-blue-600 hover:underline mt-1"
          >
            Modifier
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderItem;
