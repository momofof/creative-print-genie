
import React from "react";
import { Shirt, Image, Type, Upload, RotateCcw, RotateCw } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";

interface CustomizationToolbarProps {
  activeTool: string;
  setActiveTool: (tool: string) => void;
  onAddText?: () => void;
}

const CustomizationToolbar = ({ activeTool, setActiveTool, onAddText }: CustomizationToolbarProps) => {
  const tools = [
    { id: "products", icon: Shirt, label: "Produits" },
    { id: "designs", icon: Image, label: "Designs" },
    { id: "text", icon: Type, label: "Texte" },
    { id: "import", icon: Upload, label: "Importer" },
  ];

  const handleClick = (toolId: string) => {
    setActiveTool(toolId);
    if (toolId === "text" && onAddText) {
      onAddText();
    }
  };

  return (
    <div className="flex flex-col items-center border-r border-gray-200 bg-white w-20">
      {tools.map((tool) => (
        <button
          key={tool.id}
          className={`w-full p-4 flex flex-col items-center justify-center text-xs ${
            activeTool === tool.id ? "bg-gray-100 text-accent" : "text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => handleClick(tool.id)}
        >
          <tool.icon className="w-6 h-6 mb-1" />
          <span>{tool.label}</span>
        </button>
      ))}
      
      <div className="mt-auto border-t border-gray-200 w-full">
        <button className="w-full p-4 flex flex-col items-center justify-center text-xs text-gray-600 hover:bg-gray-50">
          <RotateCcw className="w-6 h-6 mb-1" />
          <span>Retour</span>
        </button>
        <button className="w-full p-4 flex flex-col items-center justify-center text-xs text-gray-600 hover:bg-gray-50">
          <RotateCw className="w-6 h-6 mb-1" />
          <span>Refaire</span>
        </button>
      </div>
    </div>
  );
};

export default CustomizationToolbar;
