
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

// Types pour les filtres
interface FilterCategory {
  name: string;
  options: FilterOption[];
  isExpanded: boolean;
}

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

// Données de filtre
const initialFilterData: FilterCategory[] = [
  {
    name: "Catégories",
    isExpanded: true,
    options: [
      { id: "hommes", label: "Hommes", count: 45 },
      { id: "femmes", label: "Femmes", count: 32 },
      { id: "enfants", label: "Enfants", count: 21 },
      { id: "unisexe", label: "Unisexe", count: 18 }
    ]
  },
  {
    name: "Produits",
    isExpanded: true,
    options: [
      { id: "tshirts", label: "T-shirts", count: 120 },
      { id: "sweat-shirts", label: "Sweat-shirts", count: 43 },
      { id: "vestes", label: "Vestes et gilets", count: 27 },
      { id: "vetements-sport", label: "Vêtements de sport", count: 35 },
      { id: "polos", label: "Polos", count: 25 },
      { id: "t-shirts-longues", label: "T-shirts manches longues", count: 48 },
      { id: "accessoires", label: "Accessoires et shorts", count: 15 }
    ]
  },
  {
    name: "Couleur",
    isExpanded: true,
    options: [
      { id: "noir", label: "Noir" },
      { id: "blanc", label: "Blanc" },
      { id: "gris", label: "Gris" },
      { id: "rouge", label: "Rouge" },
      { id: "bleu", label: "Bleu" },
      { id: "vert", label: "Vert" }
    ]
  },
  {
    name: "Taille",
    isExpanded: false,
    options: [
      { id: "xs", label: "XS" },
      { id: "s", label: "S" },
      { id: "m", label: "M" },
      { id: "l", label: "L" },
      { id: "xl", label: "XL" },
      { id: "xxl", label: "XXL" }
    ]
  },
  {
    name: "Prix",
    isExpanded: false,
    options: [
      { id: "0-10", label: "0€ - 10€" },
      { id: "10-20", label: "10€ - 20€" },
      { id: "20-30", label: "20€ - 30€" },
      { id: "30+", label: "30€ et plus" }
    ]
  }
];

interface ProductFiltersProps {
  onFilterChange: (category: string, option: string, checked: boolean) => void;
}

const ProductFilters = ({ onFilterChange }: ProductFiltersProps) => {
  const [filters, setFilters] = useState<FilterCategory[]>(initialFilterData);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  // Gestion de l'état d'expansion des catégories de filtres
  const toggleCategory = (index: number) => {
    const updatedFilters = [...filters];
    updatedFilters[index].isExpanded = !updatedFilters[index].isExpanded;
    setFilters(updatedFilters);
  };

  // Gestion de la sélection des filtres
  const handleFilterChange = (category: string, optionId: string, checked: boolean) => {
    const newSelectedFilters = { ...selectedFilters };
    
    if (!newSelectedFilters[category]) {
      newSelectedFilters[category] = [];
    }
    
    if (checked) {
      newSelectedFilters[category].push(optionId);
    } else {
      newSelectedFilters[category] = newSelectedFilters[category].filter(id => id !== optionId);
      if (newSelectedFilters[category].length === 0) {
        delete newSelectedFilters[category];
      }
    }
    
    setSelectedFilters(newSelectedFilters);
    onFilterChange(category, optionId, checked);
  };

  // Vérifier si un filtre est sélectionné
  const isFilterSelected = (category: string, optionId: string): boolean => {
    return selectedFilters[category]?.includes(optionId) || false;
  };

  return (
    <Card className="rounded-md shadow-sm border-gray-200">
      <CardContent className="p-4">
        <h3 className="font-medium text-lg mb-4">Filtres</h3>
        
        <div className="space-y-4">
          {filters.map((category, index) => (
            <div key={category.name} className="border-b border-gray-100 pb-3 last:border-0">
              <button 
                className="flex w-full items-center justify-between py-2 font-medium text-gray-700 hover:text-accent"
                onClick={() => toggleCategory(index)}
              >
                {category.name}
                {category.isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              
              {category.isExpanded && (
                <div className="mt-2 space-y-2">
                  {category.options.map((option) => (
                    <label 
                      key={option.id} 
                      className="flex items-center space-x-2 text-sm cursor-pointer hover:text-accent"
                    >
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-accent focus:ring-accent"
                        checked={isFilterSelected(category.name, option.id)}
                        onChange={(e) => handleFilterChange(category.name, option.id, e.target.checked)}
                      />
                      <span>{option.label}</span>
                      {option.count !== undefined && (
                        <span className="text-gray-400 text-xs">({option.count})</span>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Prix personnalisé */}
        <div className="mt-6">
          <h4 className="font-medium mb-2">Calculer le prix dégressif</h4>
          <div className="flex items-center space-x-2">
            <input 
              type="number" 
              placeholder="Quantité" 
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              min="1"
            />
            <button className="bg-gray-100 p-2 rounded-md border border-gray-300">
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2">
            <button className="text-sm text-accent hover:underline">
              Voir les réductions quantitatives disponibles
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductFilters;
