
import React from "react";
import { ProductView } from "@/types/product";

interface ProductViewsProps {
  views: ProductView[];
  activeView: string;
  setActiveView: (viewId: string) => void;
}

const ProductViews = ({ views, activeView, setActiveView }: ProductViewsProps) => {
  return (
    <div className="flex justify-center gap-2 border-t border-gray-200 p-4">
      {views.map((view) => (
        <button
          key={view.id}
          className={`border rounded p-1 ${
            activeView === view.id ? "border-accent" : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => setActiveView(view.id)}
        >
          <div className="w-16 h-16 flex items-center justify-center">
            <img src={view.image} alt={view.name} className="max-w-full max-h-full" />
          </div>
          <div className="text-xs text-center mt-1">{view.name}</div>
        </button>
      ))}
    </div>
  );
};

export default ProductViews;
