
import React from "react";

interface OrderFormHeaderProps {
  editMode: boolean;
}

const OrderFormHeader = ({ editMode }: OrderFormHeaderProps) => {
  return (
    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
      {editMode ? "Modifier votre produit" : "Commander vos produits"}
    </h2>
  );
};

export default OrderFormHeader;
