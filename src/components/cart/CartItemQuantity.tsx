
import { MinusCircle, PlusCircle } from "lucide-react";

interface CartItemQuantityProps {
  id: string;
  quantity: number;
  updateQuantity: (id: string, newQuantity: number) => void;
}

const CartItemQuantity = ({ id, quantity, updateQuantity }: CartItemQuantityProps) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => updateQuantity(id, quantity - 1)}
        className="text-gray-500 hover:text-accent"
        aria-label="Diminuer la quantité"
      >
        <MinusCircle size={20} />
      </button>
      <span className="px-2 py-1 border rounded-md min-w-[40px] text-center">
        {quantity}
      </span>
      <button
        onClick={() => updateQuantity(id, quantity + 1)}
        className="text-gray-500 hover:text-accent"
        aria-label="Augmenter la quantité"
      >
        <PlusCircle size={20} />
      </button>
    </div>
  );
};

export default CartItemQuantity;
