
import { useVariantParser } from "@/pages/supplier/hooks/useVariantParser";

// Get variant options for a product category
export const getVariantOptions = (category: string, variantType: string): string[] => {
  // Options par défaut en fonction de la catégorie et du type de variante
  const defaultOptions: Record<string, Record<string, string[]>> = {
    "t-shirts": {
      "color": ["Blanc", "Noir", "Rouge", "Bleu", "Vert"],
      "size": ["XS", "S", "M", "L", "XL", "XXL"]
    },
    "hoodies": {
      "color": ["Noir", "Gris", "Bleu Marine", "Rouge"],
      "size": ["S", "M", "L", "XL", "XXL"]
    },
    "mugs": {
      "color": ["Blanc", "Noir", "Rouge", "Bleu"],
      "design": ["Simple", "Personnalisé", "Impression recto", "Impression recto-verso"]
    },
    "posters": {
      "size": ["A3", "A2", "A1", "50x70cm", "70x100cm"],
      "paper_type": ["Standard", "Premium", "Mat", "Brillant"],
      "format": ["Paysage", "Portrait"],
      "orientation_impression": ["Recto", "Recto-verso"]
    },
    "stickers": {
      "size": ["Petit (5x5cm)", "Moyen (10x10cm)", "Grand (15x15cm)"],
      "finish": ["Mat", "Brillant", "Transparent"],
      "type_de_materiaux": ["Papier standard", "Vinyle", "Vinyle transparent", "Vinyle métallisé"]
    },
    "papier": {
      "format": ["A4", "A3", "A2", "A1", "Sur mesure"],
      "type_de_papier": ["Standard", "Recyclé", "Premium", "Couché"],
      "poids": ["80g/m²", "100g/m²", "120g/m²", "160g/m²", "250g/m²", "300g/m²"],
      "details_impression": ["Impression couleur", "Noir et blanc", "Recto", "Recto-verso"],
      "orientation_impression": ["Portrait", "Paysage"],
      "quantite": ["100", "250", "500", "1000", "2500", "5000"]
    },
    "carte-de-visite": {
      "format": ["Standard (85x55mm)", "Carré (55x55mm)", "Arrondi", "Forme personnalisée"],
      "type_de_papier": ["Standard", "Premium", "Cartonné", "Recyclé"],
      "poids": ["300g/m²", "350g/m²", "400g/m²"],
      "details_impression": ["Impression couleur", "Noir et blanc", "Recto", "Recto-verso"],
      "bat": ["Non inclus", "Numérique", "Imprimé"],
      "quantite": ["100", "250", "500", "1000"]
    },
    "impression": {
      "format": ["A4", "A3", "A2", "A1", "A0", "Sur mesure"],
      "type_de_materiaux": ["Papier standard", "Papier premium", "Carton", "Vinyle", "Tissu"],
      "poids": ["80g/m²", "100g/m²", "120g/m²", "160g/m²", "250g/m²", "300g/m²"],
      "details_impression": ["Haute définition", "Standard", "Économique"],
      "orientation_impression": ["Portrait", "Paysage"],
      "types_impression": ["Numérique", "Offset", "Sérigraphie", "Flexographie"],
      "quantite": ["50", "100", "250", "500", "1000", "2500", "5000"],
      "echantillon": ["Non", "Oui (+15€)", "Urgent (+25€)"],
      "bat": ["Numérique (PDF)", "Imprimé (+10€)", "Non requis"]
    },
    // Catégories génériques
    "vêtements": {
      "color": ["Blanc", "Noir", "Gris", "Rouge", "Bleu", "Vert"],
      "size": ["XS", "S", "M", "L", "XL", "XXL"]
    },
    // Options par défaut pour tous les types
    "default": {
      "color": ["Noir", "Blanc", "Rouge", "Bleu", "Jaune", "Vert"],
      "size": ["XS", "S", "M", "L", "XL", "XXL"],
      "format": ["A4", "A3", "A2", "A1", "A0", "Sur mesure"],
      "quantite": ["50", "100", "250", "500", "1000"],
      "bat": ["Non inclus", "Numérique", "Imprimé"],
      "poids": ["80g/m²", "100g/m²", "120g/m²", "160g/m²", "250g/m²", "300g/m²"],
      "echantillon": ["Non", "Oui (+15€)"],
      "types_impression": ["Numérique", "Offset", "Sérigraphie"],
      "type_de_materiaux": ["Papier", "Carton", "Vinyle", "Tissu", "Plastique"],
      "details_impression": ["Standard", "Haute définition", "Économique"],
      "orientation_impression": ["Portrait", "Paysage", "Recto", "Recto-verso"]
    }
  };

  // Normaliser la catégorie pour recherche
  const normalizedCategory = category.toLowerCase();
  
  // Normaliser le type de variante
  const normalizedType = variantType.toLowerCase();
  
  // Rechercher les options par catégorie puis par type
  let result: string[] = [];
  
  if (defaultOptions[normalizedCategory] && defaultOptions[normalizedCategory][normalizedType]) {
    result = defaultOptions[normalizedCategory][normalizedType];
  } else if (defaultOptions["default"][normalizedType]) {
    result = defaultOptions["default"][normalizedType];
  }
  
  return result;
};
