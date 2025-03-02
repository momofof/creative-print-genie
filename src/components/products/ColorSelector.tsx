
import React from "react";

interface Color {
  id: string;
  name: string;
  hex: string;
  available: boolean;
}

interface ColorSelectorProps {
  colors: Color[];
  selectedColor: string;
  setSelectedColor: (color: string) => void;
}

const ColorSelector = ({ colors, selectedColor, setSelectedColor }: ColorSelectorProps) => {
  return (
    <div className="mb-6">
      <div className="mb-2 font-medium">Couleur : {colors.find(c => c.id === selectedColor)?.name}</div>
      <div className="flex space-x-2">
        {colors.map((color) => (
          <button
            key={color.id}
            className={`w-8 h-8 rounded-full focus:outline-none ring-offset-2 ${
              selectedColor === color.id ? "ring-2 ring-accent" : ""
            }`}
            style={{ backgroundColor: color.hex, border: color.id === 'white' ? '1px solid #e5e7eb' : 'none' }}
            onClick={() => setSelectedColor(color.id)}
            disabled={!color.available}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;
