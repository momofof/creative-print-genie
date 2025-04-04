
import React, { useState } from "react";
import { Trash2, Edit, Save, X, Loader2 } from "lucide-react";
import { CartItem as CartItemType } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  editCartItem?: (itemId: string, productName: string, price: number, quantity: number) => void;
}

const CartItem = ({ item, updateQuantity, removeItem, editCartItem }: CartItemProps) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(item.name);
  const [editedPrice, setEditedPrice] = useState(item.price);
  const [isLoading, setIsLoading] = useState(false);
  const [supplierName, setSupplierName] = useState<string | null>(null);
  
  // Fetch supplier name if supplier_id exists
  useEffect(() => {
    const fetchSupplierName = async () => {
      if (item.supplier_id) {
        try {
          const { data, error } = await supabase
            .from('suppliers')
            .select('company_name')
            .eq('id', item.supplier_id)
            .single();
            
          if (data && !error) {
            setSupplierName(data.company_name);
          } else {
            // Fallback to a default name if we can't find the supplier
            setSupplierName("Fournisseur");
          }
        } catch (error) {
          console.error("Error fetching supplier:", error);
        }
      }
    };
    
    fetchSupplierName();
  }, [item.supplier_id]);
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (newQuantity > 0) {
      setQuantity(newQuantity);
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeItem(item.id);
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleSave = () => {
    if (editedName.trim() === '' || editedPrice <= 0) {
      return;
    }
    
    setIsLoading(true);
    
    // Call the editCartItem function if provided
    if (editCartItem) {
      editCartItem(item.id, editedName, editedPrice, quantity);
    }
    
    setIsLoading(false);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    // Reset to original values
    setEditedName(item.name);
    setEditedPrice(item.price);
    setQuantity(item.quantity);
    setIsEditing(false);
  };
  
  // Format variants for display
  const formatVariants = () => {
    if (!item.variants || Object.keys(item.variants).length === 0) {
      return null;
    }
    
    return (
      <div className="text-sm text-gray-600 mt-1">
        {Object.entries(item.variants).map(([key, value]) => (
          <div key={key}>
            <span className="font-medium capitalize">{key}:</span> {value}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 flex flex-col sm:flex-row sm:items-center">
      <div className="sm:flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
        <img 
          src={item.image || "/placeholder.svg"} 
          alt={item.name} 
          className="w-20 h-20 object-cover rounded"
        />
      </div>
      
      <div className="flex-grow">
        {isEditing ? (
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="w-full p-1 border border-gray-300 rounded"
          />
        ) : (
          <h3 className="font-medium text-gray-900">{item.name}</h3>
        )}
        
        {formatVariants()}
        
        {supplierName && (
          <div className="text-sm text-gray-600 mt-1">
            <span className="font-medium">Fournisseur:</span> {supplierName}
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-3 sm:mt-0 sm:ml-4 sm:w-auto">
        <div className="flex items-center sm:mr-8">
          <label htmlFor={`quantity-${item.id}`} className="sr-only">Quantité</label>
          <input
            id={`quantity-${item.id}`}
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            disabled={isEditing}
            className="w-16 p-1 text-center border border-gray-300 rounded"
          />
        </div>
        
        <div className="flex flex-col items-end sm:w-24">
          {isEditing ? (
            <input
              type="number"
              step="0.01"
              min="0"
              value={editedPrice}
              onChange={(e) => setEditedPrice(parseFloat(e.target.value))}
              className="w-24 p-1 border border-gray-300 rounded"
            />
          ) : (
            <span className="font-bold text-gray-900">
              {(item.price * item.quantity).toLocaleString('fr-FR')} €
            </span>
          )}
          
          <div className="flex space-x-2 mt-2">
            {isEditing ? (
              <>
                {isLoading ? (
                  <Loader2 size={18} className="text-gray-500 animate-spin" />
                ) : (
                  <>
                    <button onClick={handleSave} className="text-green-600 hover:text-green-800">
                      <Save size={18} />
                    </button>
                    <button onClick={handleCancel} className="text-gray-600 hover:text-gray-800">
                      <X size={18} />
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                {editCartItem && (
                  <button onClick={handleEdit} className="text-blue-600 hover:text-blue-800">
                    <Edit size={18} />
                  </button>
                )}
                <button onClick={handleRemove} className="text-red-600 hover:text-red-800">
                  <Trash2 size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
