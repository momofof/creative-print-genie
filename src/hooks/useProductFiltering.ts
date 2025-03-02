
import { useState, useEffect } from "react";
import { Product } from "@/types/product";

interface UseProductFilteringProps {
  allProducts: Product[];
  categoryId?: string;
  subcategoryId?: string;
}

interface UseProductFilteringResult {
  filteredProducts: Product[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: string;
  setSortBy: (sortOption: string) => void;
  appliedFilters: Record<string, string[]>;
  handleFilterChange: (category: string, option: string, checked: boolean) => void;
}

export const useProductFiltering = ({
  allProducts,
  categoryId,
  subcategoryId
}: UseProductFilteringProps): UseProductFilteringResult => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string[]>>({});

  // Effet pour filtrer les produits en fonction des critères
  useEffect(() => {
    // Filtrer d'abord par catégorie et sous-catégorie
    let result = allProducts.filter(product => {
      if (categoryId && product.category !== categoryId) return false;
      if (subcategoryId && product.subcategory !== subcategoryId.replace(/-/g, ' ')) return false;
      return true;
    });

    // Appliquer le filtre de recherche
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(term) || 
        (product.description && product.description.toLowerCase().includes(term))
      );
    }

    // Appliquer les filtres sélectionnés
    Object.entries(appliedFilters).forEach(([category, options]) => {
      if (options.length === 0) return;
      
      // Logique de filtrage en fonction de la catégorie
      if (category === "Couleur") {
        result = result.filter(product => product.color && options.includes(product.color.toLowerCase()));
      } else if (category === "Prix") {
        result = result.filter(product => {
          const price = product.price;
          return options.some(range => {
            const [min, max] = range.split("-").map(Number);
            if (range === "30+") return price >= 30;
            return price >= min && price <= (max || Infinity);
          });
        });
      }
      // Ajoutez d'autres catégories de filtres selon les besoins
    });

    // Trier les produits
    result.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "newest":
          return (b.date ? new Date(b.date).getTime() : 0) - (a.date ? new Date(a.date).getTime() : 0);
        case "rating":
          return b.rating - a.rating;
        default:
          return 0; // relevance - pas de changement à l'ordre
      }
    });

    setFilteredProducts(result);
  }, [allProducts, categoryId, subcategoryId, searchTerm, sortBy, appliedFilters]);

  // Gestionnaire pour les changements de filtre
  const handleFilterChange = (category: string, option: string, checked: boolean) => {
    setAppliedFilters(prev => {
      const newFilters = { ...prev };
      if (!newFilters[category]) newFilters[category] = [];
      
      if (checked) {
        newFilters[category].push(option);
      } else {
        newFilters[category] = newFilters[category].filter(item => item !== option);
        if (newFilters[category].length === 0) delete newFilters[category];
      }
      
      return newFilters;
    });
  };

  return {
    filteredProducts,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    appliedFilters,
    handleFilterChange
  };
};
