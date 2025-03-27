
import React from "react";
import { CartItem } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { getVariantDisplayName } from "@/components/home/ProductOrderForm/utils/variantDisplay";

interface CartItemProps {
  item: CartItem;
  onRemove: (id: string) => void;
  onEdit: (id: string) => void;
  updateQuantity?: (id: string, newQuantity: number) => void;
  removeItem?: (id: string) => void;
  editCartItem?: (id: string, newQuantity: number, options?: Record<string, string>) => void;
}

const CartItemComponent = ({ 
  item, 
  onRemove, 
  onEdit,
  updateQuantity,
  removeItem,
  editCartItem
}: CartItemProps) => {
  // Utiliser les fonctions passées directement si disponibles, sinon utiliser les props onRemove/onEdit
  const handleRemove = () => {
    if (removeItem) {
      removeItem(item.id);
    } else {
      onRemove(item.id);
    }
  };

  const handleEdit = () => {
    if (editCartItem) {
      // Si editCartItem est fourni, l'utiliser avec la quantité actuelle
      editCartItem(item.id, item.quantity);
    } else {
      onEdit(item.id);
    }
  };

  return (
    <div className="flex gap-4 p-4 border border-gray-200 rounded-xl bg-white">
      <div className="shrink-0">
        <img 
          src={item.image || '/placeholder.svg'} 
          alt={item.name} 
          className="w-16 h-16 object-cover rounded-md"
        />
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{item.name}</h3>
        
        <div className="mt-1 space-y-1 text-sm text-gray-500">
          {item.variants && Object.entries(item.variants).map(([key, value]) => (
            <div key={key} className="flex items-center gap-1">
              <span className="font-medium">{getVariantDisplayName(key)}:</span> {value}
            </div>
          ))}
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <div className="text-sm">
            <span className="font-medium text-gray-900">{item.price.toFixed(2)} €</span>
            <span className="ml-2 text-gray-500">Qté: {item.quantity}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8" 
              onClick={handleEdit}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Modifier</span>
            </Button>
            
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 text-destructive hover:text-destructive" 
              onClick={handleRemove}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Supprimer</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemComponent;
