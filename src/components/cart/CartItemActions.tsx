
import React from "react";
import { Trash2, Edit, Save, X, Loader2 } from "lucide-react";

interface CartItemActionsProps {
  isEditing: boolean;
  isLoading: boolean;
  hasEditFunction: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onRemove: () => void;
}

const CartItemActions = ({ 
  isEditing, 
  isLoading, 
  hasEditFunction, 
  onEdit, 
  onSave, 
  onCancel, 
  onRemove 
}: CartItemActionsProps) => {
  return (
    <div className="flex space-x-2 mt-2">
      {isEditing ? (
        <>
          {isLoading ? (
            <Loader2 size={18} className="text-gray-500 animate-spin" />
          ) : (
            <>
              <button onClick={onSave} className="text-green-600 hover:text-green-800">
                <Save size={18} />
              </button>
              <button onClick={onCancel} className="text-gray-600 hover:text-gray-800">
                <X size={18} />
              </button>
            </>
          )}
        </>
      ) : (
        <>
          {hasEditFunction && (
            <button onClick={onEdit} className="text-blue-600 hover:text-blue-800">
              <Edit size={18} />
            </button>
          )}
          <button onClick={onRemove} className="text-red-600 hover:text-red-800">
            <Trash2 size={18} />
          </button>
        </>
      )}
    </div>
  );
};

export default CartItemActions;
