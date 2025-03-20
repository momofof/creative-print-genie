
import React from "react";
import { Link } from "react-router-dom";

interface CartSummaryProps {
  totalPrice: number;
  handleCheckout: () => void;
}

const CartSummary = ({ totalPrice, handleCheckout }: CartSummaryProps) => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg shadow-md p-4 sticky top-24">
        <h2 className="text-lg font-medium mb-4">Récapitulatif</h2>
        
        <div className="space-y-2">
          <div className="flex justify-between pb-2">
            <span>Sous-total</span>
            <span>{totalPrice.toLocaleString('fr-FR')} €</span>
          </div>
          <div className="flex justify-between pb-2">
            <span>Livraison</span>
            <span>Calculé à l'étape suivante</span>
          </div>
          <div className="border-t pt-2 font-medium text-lg flex justify-between">
            <span>Total</span>
            <span>{totalPrice.toLocaleString('fr-FR')} €</span>
          </div>
        </div>
        
        <button
          className="w-full bg-accent text-white py-3 rounded-md font-medium mt-6 hover:bg-accent/90"
          onClick={handleCheckout}
        >
          Passer à la caisse
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
