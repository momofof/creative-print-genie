
import { useState, useEffect } from "react";

interface SearchResult {
  id: string | number;
  title: string;
  type: "category" | "subcategory";
  parentCategory?: string;
  link: string;
}

export function useSearch(searchQuery: string) {
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    const productCategories = [{
      id: "textile",
      title: "Textile",
      subcategories: ["T-shirts", "Sweats", "Casquettes", "Accessoires textiles"]
    }, {
      id: "papier",
      title: "Papier",
      subcategories: ["Cartes de visite", "Flyers", "Affiches", "Catalogues"]
    }, {
      id: "vinyl",
      title: "Vinyl",
      subcategories: ["Autocollants", "Vinyles adhésifs", "Bâches"]
    }, {
      id: "accessoires",
      title: "Accessoires",
      subcategories: ["Mugs", "Coques téléphone", "Badges", "Porte-clés"]
    }, {
      id: "panneaux",
      title: "Panneaux publicitaires",
      subcategories: ["Panneaux extérieurs", "Supports rigides", "PLV"]
    }, {
      id: "enseignes",
      title: "Enseignes publicitaires",
      subcategories: ["Enseignes lumineuses", "Totems", "Lettres découpées"]
    }, {
      id: "vehicules",
      title: "Véhicules",
      subcategories: ["Covering", "Lettrage", "Stickers", "Magnétiques"]
    }, {
      id: "ustensiles",
      title: "Ustensiles",
      subcategories: ["Ustensiles de cuisine", "Plateaux", "Dessous de verre", "Sets de table"]
    }, {
      id: "bijoux",
      title: "Bijoux",
      subcategories: ["Colliers", "Bracelets", "Boucles d'oreilles", "Pendentifs"]
    }, {
      id: "emballage",
      title: "Emballage",
      subcategories: ["Boîtes personnalisées", "Papier cadeau", "Étiquettes", "Rubans"]
    }];

    if (searchQuery.trim() === "") {
      setResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Recherche dans les catégories
    productCategories.forEach(category => {
      if (category.title.toLowerCase().includes(query)) {
        searchResults.push({
          id: category.id,
          title: category.title,
          type: "category",
          link: `/products/${category.id}`
        });
      }

      // Recherche dans les sous-catégories
      category.subcategories.forEach(subcategory => {
        if (subcategory.toLowerCase().includes(query)) {
          searchResults.push({
            id: `${category.id}-${subcategory}`,
            title: subcategory,
            type: "subcategory",
            parentCategory: category.title,
            link: `/products/${category.id}/${subcategory.toLowerCase().replace(/ /g, "-")}`
          });
        }
      });
    });

    setResults(searchResults);
  }, [searchQuery]);

  return results;
}
