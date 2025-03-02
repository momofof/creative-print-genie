
import React from "react";
import { Shield, Truck, CreditCard } from "lucide-react";

const FooterPaymentInfo = () => {
  return (
    <div className="bg-gray-100 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Moyens de paiement */}
          <div className="flex flex-col items-center text-center">
            <CreditCard className="h-10 w-10 text-gray-700 mb-4" />
            <h3 className="font-medium text-lg mb-2">Moyens de paiement sécurisés</h3>
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              <div className="bg-white rounded p-2 shadow-sm">
                <img src="https://cdn-icons-png.flaticon.com/512/196/196566.png" alt="Visa" className="h-8" />
              </div>
              <div className="bg-white rounded p-2 shadow-sm">
                <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="Mastercard" className="h-8" />
              </div>
              <div className="bg-white rounded p-2 shadow-sm">
                <img src="https://cdn-icons-png.flaticon.com/512/196/196565.png" alt="PayPal" className="h-8" />
              </div>
              <div className="bg-white rounded p-2 shadow-sm">
                <img src="https://cdn-icons-png.flaticon.com/512/5968/5968244.png" alt="Apple Pay" className="h-8" />
              </div>
            </div>
          </div>
          
          {/* Garantie satisfaction */}
          <div className="flex flex-col items-center text-center">
            <Shield className="h-10 w-10 text-gray-700 mb-4" />
            <h3 className="font-medium text-lg mb-2">Notre garantie satisfaction</h3>
            <p className="text-gray-600">La qualité de nos produits garantie pendant plus de 30 jours.</p>
            <button className="mt-3 text-accent hover:underline text-sm font-medium">
              Plus d'infos
            </button>
          </div>
          
          {/* Livraison */}
          <div className="flex flex-col items-center text-center">
            <Truck className="h-10 w-10 text-gray-700 mb-4" />
            <h3 className="font-medium text-lg mb-2">Livraison partout dans le monde</h3>
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              <div className="bg-white rounded p-2 shadow-sm">
                <img src="https://cdn-icons-png.flaticon.com/512/5968/5968896.png" alt="DHL" className="h-8" />
              </div>
              <div className="bg-white rounded p-2 shadow-sm">
                <img src="https://cdn-icons-png.flaticon.com/512/3967/3967318.png" alt="FedEx" className="h-8" />
              </div>
              <div className="bg-white rounded p-2 shadow-sm">
                <img src="https://cdn-icons-png.flaticon.com/512/5968/5968542.png" alt="UPS" className="h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterPaymentInfo;
