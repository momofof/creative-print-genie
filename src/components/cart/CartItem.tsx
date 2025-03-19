
import { MinusCircle, PlusCircle, Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/types/product";

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (id: string, newQuantity: number) => void;
  removeItem: (id: string) => void;
}

const CartItem = ({ item, updateQuantity, removeItem }: CartItemProps) => {
  return (
    <div className="p-4 flex flex-col sm:flex-row gap-4">
      <div className="flex-shrink-0">
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          className="w-24 h-24 object-cover rounded"
        />
      </div>
      <div className="flex-grow">
        <h3 className="font-medium">{item.name}</h3>
        <p className="text-accent font-medium mt-1">
          {item.price.toLocaleString('fr-FR')} €
        </p>
        
        {item.variants && Object.keys(item.variants).length > 0 && (
          <div className="mt-1 text-sm text-gray-500">
            {Object.entries(item.variants).map(([key, value]) => (
              <span key={key} className="mr-3">
                {key}: {value}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center mt-2 space-x-2">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="text-gray-500 hover:text-accent"
            aria-label="Diminuer la quantité"
          >
            <MinusCircle size={20} />
          </button>
          <span className="px-2 py-1 border rounded-md min-w-[40px] text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="text-gray-500 hover:text-accent"
            aria-label="Augmenter la quantité"
          >
            <PlusCircle size={20} />
          </button>
          <button
            onClick={() => removeItem(item.id)}
            className="ml-auto text-red-600 hover:text-red-800"
            aria-label="Supprimer du panier"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
