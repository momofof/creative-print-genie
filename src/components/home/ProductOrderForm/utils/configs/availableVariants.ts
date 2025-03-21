
// Define available variants for each product category
const availableVariants: Record<string, string[]> = {
  "vêtements": ["color", "size", "print_design", "quantite", "format", "type_de_materiaux", "poids", "details_impression", 
                "orientation_impression", "types_impression", "echantillon", "bat"],
  "t-shirts": ["color", "size", "print_design", "quantite", "format", "type_de_materiaux", "poids", "details_impression", 
                "orientation_impression", "types_impression", "echantillon", "bat"],
  "hoodies": ["color", "size", "print_design", "quantite", "format", "type_de_materiaux", "poids", "details_impression", 
                "orientation_impression", "types_impression", "echantillon", "bat"],
  "mugs": ["color", "design", "quantite", "format", "type_de_materiaux", "poids", "details_impression", 
                "orientation_impression", "types_impression", "echantillon", "bat"],
  "posters": ["size", "paper_type", "format", "orientation_impression", "quantite", "type_de_materiaux", "poids", "details_impression", 
                "types_impression", "echantillon", "bat"],
  "stickers": ["size", "finish", "type_de_materiaux", "details_impression", "quantite", "format", "poids", 
                "orientation_impression", "types_impression", "echantillon", "bat"],
  "accessoires": ["color", "size", "quantite", "format", "type_de_materiaux", "poids", "details_impression", 
                "orientation_impression", "types_impression", "echantillon", "bat"],
  "casquettes": ["color", "size", "quantite", "format", "type_de_materiaux", "poids", "details_impression", 
                "orientation_impression", "types_impression", "echantillon", "bat"],
  "sport": ["color", "size", "quantite", "format", "type_de_materiaux", "poids", "details_impression", 
                "orientation_impression", "types_impression", "echantillon", "bat"],
  "vélo": ["color", "size", "face_a_imprimer", "quantite", "format", "type_de_materiaux", "poids", "details_impression", 
                "orientation_impression", "types_impression", "echantillon", "bat"],
  "impression": ["quantite", "format", "type_de_materiaux", "poids", "details_impression", 
                 "orientation_impression", "types_impression", "echantillon", "bat"],
  "vinyl": ["quantite", "format", "type_de_materiaux", "poids", "details_impression", 
           "orientation_impression", "types_impression", "echantillon", "bat"],
  "panneaux": ["quantite", "format", "type_de_materiaux", "poids", "details_impression", 
              "orientation_impression", "types_impression", "echantillon", "bat"],
  "enseignes": ["quantite", "format", "type_de_materiaux", "poids", "details_impression", 
               "orientation_impression", "types_impression", "echantillon", "bat"],
  "papier": ["quantite", "format", "type_de_papier", "poids", "details_impression", 
            "orientation_impression", "echantillon", "bat"],
  "carte-de-visite": ["quantite", "format", "type_de_papier", "poids", "details_impression", 
                     "orientation_impression", "echantillon", "bat"],
  "textile": ["quantite", "format", "type_de_materiaux", "poids", "details_impression", 
             "orientation_impression", "types_impression", "echantillon", "bat"],
};

// Function to get available variants for a product category
export const getAvailableVariants = (category: string): string[] => {
  // Vérifier d'abord la catégorie exacte, puis vérifier la subcategory si pas trouvé
  return availableVariants[category] || 
         availableVariants[category.toLowerCase()] || 
         [];
};
