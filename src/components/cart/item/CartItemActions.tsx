
import React from 'react';
import { Edit, Trash } from 'lucide-react';

interface CartItemActionsProps {
  onEdit: () => void;
  onRemove: () => void;
}

const CartItemActions = ({ onEdit, onRemove }: CartItemActionsProps) => {
  return (
    <div className="flex space-x-2">
      <button 
        onClick={onEdit}
        className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
        aria-label="Modifier"
      >
        <Edit size={16} />
      </button>
      <button 
        onClick={onRemove}
        className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
        aria-label="Supprimer"
      >
        <Trash size={16} />
      </button>
    </div>
  );
};

export default CartItemActions;
