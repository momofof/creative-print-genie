
// Define quantity options for each product category
const quantityOptions: Record<string, number[]> = {
  "vêtements": [1, 2, 3, 4, 5, 10],
  "t-shirts": [1, 2, 3, 4, 5, 10],
  "hoodies": [1, 2, 3, 4, 5, 10],
  "mugs": [1, 2, 3, 4, 5, 10, 20],
  "posters": [1, 2, 3, 4, 5, 10, 20],
  "stickers": [10, 20, 30, 40, 50, 100],
  "accessoires": [1, 2, 3, 4, 5, 10],
  "casquettes": [1, 2, 3, 4, 5, 10],
  "sport": [1, 2, 3, 4, 5],
  "vélo": [1, 2, 3, 4, 5],
  "impression": [10, 20, 50, 100, 250, 500, 1000],
  "vinyl": [10, 20, 50, 100, 250, 500, 1000],
  "panneaux": [10, 20, 50, 100, 250, 500, 1000],
  "enseignes": [10, 20, 50, 100, 250, 500, 1000],
  "papier": [10, 20, 50, 100, 250, 500, 1000],
  "textile": [10, 20, 50, 100, 250, 500, 1000],
};

// Function to get quantity options for a product category
export const getQuantityOptions = (category: string): number[] => {
  // Vérifier d'abord la catégorie exacte, puis vérifier la subcategory si pas trouvé
  return quantityOptions[category] || 
         quantityOptions[category.toLowerCase()] || 
         [1, 2, 3, 4, 5];
};
