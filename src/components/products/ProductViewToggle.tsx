
import React from "react";
import { Grid, List } from "lucide-react";

interface ProductViewToggleProps {
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}

const ProductViewToggle = ({ view, onViewChange }: ProductViewToggleProps) => {
  return (
    <div className="flex items-center space-x-1 border border-gray-300 rounded-md overflow-hidden">
      <button
        onClick={() => onViewChange("grid")}
        className={`p-1.5 ${view === "grid" ? "bg-gray-200" : "bg-white hover:bg-gray-100"}`}
        aria-label="Vue en grille"
      >
        <Grid className="h-4 w-4" />
      </button>
      <button
        onClick={() => onViewChange("list")}
        className={`p-1.5 ${view === "list" ? "bg-gray-200" : "bg-white hover:bg-gray-100"}`}
        aria-label="Vue en liste"
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ProductViewToggle;
