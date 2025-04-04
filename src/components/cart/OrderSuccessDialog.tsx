
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CartItem } from "@/types/product";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface OrderSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: CartItem[];
  totalPrice: number;
  transactionId?: string;
}

const OrderSuccessDialog = ({ 
  open, 
  onOpenChange, 
  cartItems, 
  totalPrice,
  transactionId
}: OrderSuccessDialogProps) => {
  const [supplierNames, setSupplierNames] = useState<{[key: string]: string}>({});
  
  // Fetch supplier names for all items that have supplier_id
  useEffect(() => {
    const fetchSupplierNames = async () => {
      if (!open) return;
      
      const supplierIds = cartItems
        .filter(item => item.supplier_id)
        .map(item => item.supplier_id as string);
      
      if (supplierIds.length === 0) return;
      
      try {
        const { data, error } = await supabase
          .from('suppliers')
          .select('id, company_name')
          .in('id', supplierIds);
          
        if (data && !error) {
          const names: {[key: string]: string} = {};
          data.forEach(supplier => {
            names[supplier.id] = supplier.company_name;
          });
          setSupplierNames(names);
        }
      } catch (error) {
        console.error("Error fetching supplier names:", error);
      }
    };
    
    fetchSupplierNames();
  }, [open, cartItems]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <DialogTitle className="text-center">Article(s) ajouté(s) au panier</DialogTitle>
          <DialogDescription className="text-center">
            Votre panier a été mis à jour avec succès.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <h3 className="font-medium mb-2">Récapitulatif</h3>
          <div className="max-h-48 overflow-y-auto border rounded-md divide-y">
            {cartItems.map((item) => (
              <div key={item.id} className="p-2 flex items-start">
                <img 
                  src={item.image || "/placeholder.svg"} 
                  alt={item.name} 
                  className="w-12 h-12 object-cover rounded mr-3"
                />
                <div className="flex-grow">
                  <p className="font-medium">{item.name}</p>
                  <div className="text-sm text-gray-600">
                    <p>Quantité: {item.quantity}</p>
                    {item.variants && Object.keys(item.variants).length > 0 && (
                      <div className="text-xs">
                        {Object.entries(item.variants).map(([key, value]) => (
                          <span key={key} className="mr-2">
                            <span className="font-medium capitalize">{key}:</span> {value}
                          </span>
                        ))}
                      </div>
                    )}
                    {item.supplier_id && supplierNames[item.supplier_id] && (
                      <p className="text-xs mt-1">
                        <span className="font-medium">Fournisseur:</span> {supplierNames[item.supplier_id]}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{(item.price * item.quantity).toLocaleString('fr-FR')} €</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex justify-between">
            <span className="font-medium">Total</span>
            <span className="font-bold">{totalPrice.toLocaleString('fr-FR')} €</span>
          </div>
          
          {transactionId && (
            <div className="mt-2 text-sm text-gray-600">
              <span className="font-medium">ID de Transaction:</span> {transactionId}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:justify-between mt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="sm:flex-1"
          >
            Continuer mes achats
          </Button>
          
          <Link to="/cart" className="sm:flex-1">
            <Button
              className="w-full"
              onClick={() => onOpenChange(false)}
            >
              Voir mon panier
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderSuccessDialog;
