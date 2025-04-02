
import { Product } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";

// Get available variants for a product category
export const getAvailableVariants = (category: string): string[] => {
  // Essayer d'abord la sous-catégorie si elle existe
  const variants = {
    "t-shirts": ["color", "size", "print_design"],
    "hoodies": ["color", "size", "print_design"],
    "mugs": ["color", "design"],
    "posters": ["size", "paper_type", "format", "orientation_impression"],
    "stickers": ["size", "finish", "type_de_materiaux", "details_impression"],
    "accessoires": ["color", "size"],
    "casquettes": ["color", "size"],
    "sport": ["color", "size"],
    "vélo": ["color", "size", "face_a_imprimer"],
    "papier": ["format", "type_de_papier", "poids", "details_impression", "orientation_impression", "echantillon", "bat"],
    "carte-de-visite": ["format", "type_de_papier", "poids", "details_impression", "orientation_impression", "echantillon", "bat"],
    "impression": ["quantite", "format", "type_de_materiaux", "poids", "details_impression", "orientation_impression", "types_impression", "echantillon", "bat"],
    // Catégories génériques
    "vêtements": ["color", "size", "print_design"],
    // Par défaut, inclure uniquement les champs qui existent réellement dans la table products_complete
    "default": ["color", "size", "format", "quantite", "bat", "poids", "echantillon", "types_impression", 
               "type_de_materiaux", "details_impression", "orientation_impression"]
  };

  const normalizedCategory = category.toLowerCase();
  
  // Retourner les variants pour cette catégorie, ou par défaut un ensemble standard
  return variants[normalizedCategory] || variants["default"];
};

// Get quantity options for a product category
export const getQuantityOptions = (category: string): number[] => {
  const options = {
    "t-shirts": [1, 5, 10, 25, 50, 100],
    "hoodies": [1, 5, 10, 25, 50],
    "mugs": [1, 5, 10, 25, 50, 100],
    "posters": [1, 5, 10, 25, 50, 100],
    "stickers": [10, 25, 50, 100, 250, 500],
    "accessoires": [1, 5, 10, 25, 50],
    "casquettes": [1, 5, 10, 25, 50, 100],
    "sport": [1, 5, 10, 25, 50],
    "vélo": [1, 5, 10, 25],
    "papier": [100, 250, 500, 1000, 2500, 5000],
    "carte-de-visite": [100, 250, 500, 1000, 2500, 5000],
    "impression": [50, 100, 250, 500, 1000, 2500, 5000],
    // Catégories génériques
    "vêtements": [1, 5, 10, 25, 50, 100],
    // Par défaut
    "default": [1, 5, 10, 25, 50, 100, 250, 500, 1000]
  };

  const normalizedCategory = category.toLowerCase();
  
  return options[normalizedCategory] || options["default"];
};

// Extract variant options specific to a product from the database
export const extractVariantOptionsFromProduct = async (product: Product): Promise<Record<string, string[]>> => {
  try {
    if (!product || !product.id) {
      console.log("Produit non défini ou sans ID");
      return {};
    }

    console.log("Récupération des options pour le produit ID:", product.id);
    
    // Récupérer le produit complet depuis la base de données
    const { data: productData, error } = await supabase
      .from('products_complete')
      .select('*')
      .eq('id', product.id)
      .single();
    
    if (error) {
      console.error("Erreur lors de la récupération du produit:", error);
      return {};
    }
    
    if (!productData) {
      console.warn("Aucun produit trouvé avec l'ID:", product.id);
      return {};
    }
    
    console.log("Données du produit récupérées:", productData);
    
    // Dictionnaire mappant les champs de variantes aux noms de colonnes d'options
    const variantToOptionsMap = {
      'color': 'color_options',
      'size': 'size_options',
      'format': 'format_options',
      'poids': 'poids_options',
      'bat': 'bat_options',
      'quantite': 'quantite_options',
      'echantillon': 'echantillon_options',
      'types_impression': 'types_impression_options',
      'type_de_materiaux': 'type_de_materiaux_options',
      'details_impression': 'details_impression_options',
      'orientation_impression': 'orientation_impression_options'
    };
    
    const options: Record<string, string[]> = {};
    
    // Parcourir le dictionnaire et extraire les options
    for (const [variantField, optionsField] of Object.entries(variantToOptionsMap)) {
      if (productData[optionsField] && Array.isArray(productData[optionsField])) {
        // Si des options array sont définies, les utiliser
        options[variantField] = productData[optionsField];
        console.log(`Options trouvées pour ${variantField}:`, options[variantField]);
      } else if (productData[variantField] && typeof productData[variantField] === 'string' && productData[variantField].trim() !== '') {
        // Fallback: si la valeur est définie comme un string dans le champ individuel
        options[variantField] = [productData[variantField]];
        console.log(`Fallback: option unique trouvée pour ${variantField}:`, options[variantField]);
      }
    }
    
    console.log("Options de variants extraites:", options);
    return options;
  } catch (error) {
    console.error("Erreur dans extractVariantOptionsFromProduct:", error);
    return {};
  }
};
