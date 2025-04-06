
import React from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { CartItem } from "@/types/product";

interface CartSummaryProps {
  totalPrice: number;
  isProcessingPayment: boolean;
  handleCheckout: () => void;
}

const CartSummary = ({ 
  totalPrice, 
  isProcessingPayment, 
  handleCheckout 
}: CartSummaryProps) => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg shadow-md p-4 sticky top-24">
        <h2 className="text-lg font-medium mb-4">Récapitulatif</h2>
        
        <div className="space-y-2">
          <div className="flex justify-between pb-2">
            <span>Sous-total</span>
            <span>{totalPrice.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <div className="flex justify-between pb-2">
            <span>Livraison</span>
            <span>Calculé à l'étape suivante</span>
          </div>
          <div className="border-t pt-2 font-medium text-lg flex justify-between">
            <span>Total</span>
            <span>{totalPrice.toLocaleString('fr-FR')} FCFA</span>
          </div>
        </div>
        
        <button
          className="w-full bg-accent text-white py-3 rounded-md font-medium mt-6 hover:bg-accent/90 flex items-center justify-center"
          onClick={handleCheckout}
          disabled={isProcessingPayment}
        >
          {isProcessingPayment ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Traitement en cours...
            </>
          ) : (
            "Passer à la caisse"
          )}
        </button>
        
        <Link
          to="/"
          className="w-full block text-center border border-gray-300 text-gray-700 py-3 rounded-md font-medium mt-3 hover:bg-gray-50"
        >
          Continuer vos achats
        </Link>
      </div>
    </div>
  );
};

export default CartSummary;
