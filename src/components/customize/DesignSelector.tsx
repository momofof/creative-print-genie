
import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DesignCategory, DesignItem } from "@/types/product";

interface DesignSelectorProps {
  onSelectDesign: (designUrl: string) => void;
}

// Données simulées pour les designs
const designCategories: DesignCategory[] = [
  {
    id: "populaire",
    name: "Populaire",
    designs: [
      { id: "design1", name: "Design 1", image: "/lovable-uploads/d3ae8f29-2c71-4cc2-8d20-f6b99685c61c.png", category: "populaire" },
      { id: "design2", name: "Design 2", image: "/lovable-uploads/37a81eff-34b6-47cc-b819-69f72dfebbde.png", category: "populaire" },
      { id: "design3", name: "Design 3", image: "/lovable-uploads/1365a433-cc0b-4382-8d64-0402ccf2eccd.png", category: "populaire" },
    ],
  },
  {
    id: "sports",
    name: "Sports",
    designs: [
      { id: "design4", name: "Football", image: "/lovable-uploads/42f681a1-997f-45a3-aaf6-b01d41e79b33.png", category: "sports" },
      { id: "design5", name: "Basketball", image: "/lovable-uploads/9c50297c-4e85-4eba-92cf-1786dbe7853d.png", category: "sports" },
    ],
  },
  {
    id: "animaux",
    name: "Animaux",
    designs: [
      { id: "design6", name: "Chat", image: "/lovable-uploads/9850efb4-ef57-4de7-8707-ef1e82277265.png", category: "animaux" },
      { id: "design7", name: "Chien", image: "/lovable-uploads/c00742ed-9c77-47e2-97c4-41a9401e0f18.png", category: "animaux" },
    ],
  },
];

const DesignSelector: React.FC<DesignSelectorProps> = ({ onSelectDesign }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("populaire");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredDesigns = searchTerm 
    ? designCategories.flatMap(cat => cat.designs).filter(design => 
        design.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : designCategories.find(cat => cat.id === selectedCategory)?.designs || [];

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input
          type="search"
          placeholder="Rechercher des designs..."
          className="pl-10 pr-10"
          value={searchTerm}
          onChange={handleSearch}
        />
        {searchTerm && (
          <button 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setSearchTerm("")}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {!searchTerm && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {designCategories.map(category => (
            <button
              key={category.id}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                selectedCategory === category.id 
                  ? "bg-teal-500 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto flex-1">
        {filteredDesigns.map(design => (
          <div 
            key={design.id}
            className="border rounded bg-gray-50 hover:border-teal-500 cursor-pointer p-2 flex items-center justify-center aspect-square"
            onClick={() => onSelectDesign(design.image)}
          >
            <img 
              src={design.image} 
              alt={design.name} 
              className="max-w-full max-h-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DesignSelector;
