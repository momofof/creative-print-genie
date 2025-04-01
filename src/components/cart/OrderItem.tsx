
import { CartItem } from "@/types/product";
import { getVariantDisplayName } from "@/components/home/ProductOrderForm/utils/variantDisplay";

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
  // Cette fonction consolide l'affichage des options/variantes
  const renderVariantOptions = () => {
    // Si aucun variant n'est défini, retourner null
    if (!item.variants || Object.keys(item.variants).length === 0) return null;
    
    return (
      <div className="mt-1 text-xs text-gray-500">
        {Object.entries(item.variants).map(([key, value]) => (
          <span key={key} className="mr-2">
            {getVariantDisplayName(key, value)}
          </span>
        ))}
      </div>
    );
  };

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
        </div>
        
        {renderVariantOptions()}
        
        <div className="flex justify-between mt-1">
          <p className="text-sm text-gray-500">
            Quantité: {quantity}
          </p>
          <p className="text-sm font-medium">
            {(item.price * quantity).toLocaleString('fr-FR')} €
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
