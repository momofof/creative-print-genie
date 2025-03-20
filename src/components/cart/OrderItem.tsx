
import { CartItem } from "@/types/product";
import { Edit2, MinusCircle, PlusCircle } from "lucide-react";

interface OrderItemProps {
  item: CartItem;
  itemKey: string;
  quantity: number;
  editMode: boolean;
  onEditItem?: (item: CartItem) => void;
  onQuantityChange?: (item: CartItem, delta: number) => void;
}

const OrderItem = ({
  item,
  itemKey,
  quantity,
  editMode,
  onEditItem,
  onQuantityChange,
}: OrderItemProps) => {
  return (
    <div key={itemKey} className="flex items-start gap-3">
      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img 
          src={item.image || "/placeholder.svg"} 
          alt={item.name}
          className="h-full w-full object-cover object-center" 
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <p className="font-medium">{item.name}</p>
          {!editMode && onEditItem && (
            <button
              onClick={() => onEditItem(item)}
              className="ml-2 text-blue-600 hover:text-blue-800"
              aria-label="Modifier les options"
            >
              <Edit2 size={16} />
            </button>
          )}
        </div>
        
        {item.variants && Object.keys(item.variants).length > 0 && (
          <div className="mt-1 text-xs text-gray-500">
            {Object.entries(item.variants).map(([key, value]) => (
              <span key={key} className="mr-2">
                {key}: {value}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex justify-between mt-1">
          {editMode && onQuantityChange ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onQuantityChange(item, -1)}
                className="text-gray-500 hover:text-accent"
              >
                <MinusCircle size={16} />
              </button>
              <span className="px-2 py-0.5 border rounded-md min-w-[30px] text-center text-sm">
                {quantity}
              </span>
              <button
                onClick={() => onQuantityChange(item, 1)}
                className="text-gray-500 hover:text-accent"
              >
                <PlusCircle size={16} />
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Quantité: {quantity}
            </p>
          )}
          <p className="text-sm font-medium">
            {(item.price * quantity).toLocaleString('fr-FR')} €
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
