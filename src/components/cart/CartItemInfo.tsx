
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import CartItemVariants from "./CartItemVariants";

interface CartItemInfoProps {
  id: string;
  name: string;
  variants?: Record<string, string>;
  supplier_id?: string;
  isEditing: boolean;
  editedName: string;
  setEditedName: (name: string) => void;
}

const CartItemInfo = ({ 
  id, 
  name, 
  variants, 
  supplier_id, 
  isEditing, 
  editedName, 
  setEditedName 
}: CartItemInfoProps) => {
  const [supplierName, setSupplierName] = useState<string | null>(null);
  
  // Fetch supplier name if supplier_id exists
  useEffect(() => {
    const fetchSupplierName = async () => {
      if (supplier_id) {
        try {
          const { data, error } = await supabase
            .from('suppliers')
            .select('company_name')
            .eq('id', supplier_id)
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
  }, [supplier_id]);

  return (
    <div className="flex-grow">
      {isEditing ? (
        <input
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          className="w-full p-1 border border-gray-300 rounded"
        />
      ) : (
        <h3 className="font-medium text-gray-900">{name}</h3>
      )}
      
      <CartItemVariants variants={variants} />
      
      {supplierName && (
        <div className="text-sm text-gray-600 mt-1">
          <span className="font-medium">Fournisseur:</span> {supplierName}
        </div>
      )}
    </div>
  );
};

export default CartItemInfo;
