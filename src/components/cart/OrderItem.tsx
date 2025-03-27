
// Correction de l'erreur TS2554: Expected 1 arguments, but got 2.
// On s'assure que getVariantDisplayName est appelé avec un seul argument
import React from "react";
import { CartItem } from "@/types/product";
import { getVariantDisplayName } from "@/components/home/ProductOrderForm/utils/variantDisplay";

interface OrderItemProps {
  item: CartItem;
}

const OrderItem: React.FC<OrderItemProps> = ({ item }) => {
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
        <div className="text-xs text-gray-500">Qté: {item.quantity}</div>
      </div>
    </div>
  );
};

export default OrderItem;
