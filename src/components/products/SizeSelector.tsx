
import React from "react";
import { Link } from "react-router-dom";

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  setSelectedSize: (size: string) => void;
}

const SizeSelector = ({ sizes, selectedSize, setSelectedSize }: SizeSelectorProps) => {
  return (
    <div className="mb-6">
      <div className="mb-2 font-medium">Taille</div>
      <div className="grid grid-cols-6 gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            className={`border py-2 text-center font-medium rounded focus:outline-none transition-colors ${
              selectedSize === size
                ? "bg-accent text-primary border-accent"
                : "border-gray-300 hover:border-accent"
            }`}
            onClick={() => setSelectedSize(size)}
          >
            {size}
          </button>
        ))}
      </div>
      <div className="mt-2 text-sm text-gray-600">
        <Link to="#size-guide" className="underline hover:text-accent">
          Guide des tailles
        </Link>
      </div>
    </div>
  );
};

export default SizeSelector;
