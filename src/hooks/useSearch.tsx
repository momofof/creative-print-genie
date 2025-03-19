import { useState, useEffect } from "react";
import { productCategories } from "@/data";

interface SearchResult {
  id: string;
  title: string;
  type: "category" | "subcategory";
  parentCategory?: string;
  link: string;
}

export function useSearch(searchQuery: string) {
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (!searchQuery.trim()) {
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
            link: `/products/${category.id}/${subcategory.toLowerCase().replace(/\s+/g, '-')}`
          });
        }
      });
    });

    setResults(searchResults);
  }, [searchQuery]);

  return results;
}
