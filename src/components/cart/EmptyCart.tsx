
import React from "react";
import { Link } from "react-router-dom";

const EmptyCart = () => {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-medium mb-4">Votre panier est vide</h2>
      <p className="text-gray-600 mb-8">
        Parcourez notre catalogue pour trouver des produits à ajouter à votre panier
      </p>
      <Link 
        to="/" 
        className="bg-accent text-white px-6 py-3 rounded-md font-medium hover:bg-accent/90 inline-block"
      >
        Voir le catalogue
      </Link>
    </div>
  );
};

export default EmptyCart;
