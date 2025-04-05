
import React from "react";

interface CartItemImageProps {
  image: string;
  name: string;
}

const CartItemImage = ({ image, name }: CartItemImageProps) => {
  return (
    <div className="sm:flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
      <img 
        src={image || "/placeholder.svg"} 
        alt={name} 
        className="w-20 h-20 object-cover rounded"
      />
    </div>
  );
};

export default CartItemImage;
