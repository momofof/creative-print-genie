
import { Product } from "@/types/product";

// Get available variants from a product category or subcategory
export const getAvailableVariants = (categoryOrSubcategory: string): string[] => {
  // Convert to lowercase for case-insensitive matching
  const category = categoryOrSubcategory.toLowerCase();
  
  // Map of categories/subcategories to their available variant types
  const categoryVariantsMap: Record<string, string[]> = {
    // Textile categories
    't-shirts': ['color', 'size'],
    'polos': ['color', 'size'],
    'sweats': ['color', 'size'],
    'vestes': ['color', 'size'],
    'casquettes': ['color', 'size'],
    'textile': ['color', 'size'],
    
    // Papeterie categories
    'flyers': ['format', 'quantite', 'types_impression', 'poids'],
    'affiches': ['format', 'quantite', 'types_impression', 'poids'],
    'dépliants': ['format', 'quantite', 'types_impression', 'poids', 'details_impression'],
    'cartes de visite': ['format', 'quantite', 'types_impression', 'details_impression'],
    'carte-de-visite': ['format', 'quantite', 'types_impression', 'details_impression'],
    'papier entête': ['format', 'quantite', 'types_impression'],
    'papier': ['format', 'quantite', 'types_impression', 'poids'],
    
    // Bijoux categories
    'bijoux': ['color', 'size', 'type_de_materiaux'],
    'colliers': ['color', 'size', 'type_de_materiaux'],
    'bracelets': ['color', 'size', 'type_de_materiaux'],
    'boucles d\'oreilles': ['color', 'size', 'type_de_materiaux'],
    'pendentifs': ['color', 'size', 'type_de_materiaux'],
    
    // Vinyl categories
    'vinyl': ['format', 'color', 'quantite'],
    'autocollants': ['format', 'color', 'quantite'],
    'vinyles adhésifs': ['format', 'color', 'quantite', 'types_impression'],
    'bâches': ['format', 'quantite', 'types_impression'],
    
    // Panneaux categories
    'panneaux': ['format', 'quantite', 'type_de_materiaux'],
    'panneaux extérieurs': ['format', 'quantite', 'type_de_materiaux'],
    'supports rigides': ['format', 'quantite', 'type_de_materiaux'],
    'plv': ['format', 'quantite', 'types_impression'],
    
    // Enseignes categories
    'enseignes': ['format', 'types_impression', 'type_de_materiaux'],
    'enseignes lumineuses': ['format', 'types_impression', 'type_de_materiaux'],
    'totems': ['format', 'types_impression', 'type_de_materiaux'],
    'lettres découpées': ['format', 'color', 'type_de_materiaux'],
    
    // Vehicules categories
    'vehicules': ['format', 'color', 'types_impression'],
    'covering': ['format', 'color', 'types_impression'],
    'lettrage': ['format', 'color', 'types_impression'],
    'stickers': ['format', 'color', 'quantite'],
    'magnétiques': ['format', 'color', 'quantite'],
    
    // Accessoires categories
    'accessoires': ['color', 'format', 'quantite'],
    'mugs': ['color', 'quantite'],
    'coques téléphone': ['format', 'color', 'quantite'],
    'badges': ['format', 'color', 'quantite'],
    'porte-clés': ['color', 'quantite'],
    
    // Ustensiles categories
    'ustensiles': ['format', 'color', 'type_de_materiaux'],
    'ustensiles de cuisine': ['format', 'color', 'type_de_materiaux'],
    'plateaux': ['format', 'color', 'type_de_materiaux'],
    'dessous de verre': ['format', 'color', 'type_de_materiaux'],
    'sets de table': ['format', 'color', 'type_de_materiaux'],
    
    // Emballage categories
    'emballage': ['format', 'color', 'quantite'],
    'boîtes personnalisées': ['format', 'color', 'quantite'],
    'papier cadeau': ['format', 'color', 'quantite'],
    'étiquettes': ['format', 'color', 'quantite'],
    'rubans': ['color', 'quantite'],
    
    // Generic categories
    'signalétique': ['format', 'quantite', 'type_de_materiaux', 'support'],
    'goodies': ['color', 'format', 'quantite'],
    
    // Default for any other category
    'default': ['color', 'size', 'format', 'quantite']
  };
  
  return categoryVariantsMap[category] || categoryVariantsMap['default'];
};

// Get quantity options based on product category
export const getQuantityOptions = (categoryOrSubcategory: string): number[] => {
  // Convert to lowercase for case-insensitive matching
  const category = categoryOrSubcategory.toLowerCase();
  
  // Map of categories to their quantity options
  const quantityOptionsMap: Record<string, number[]> = {
    // Papeterie (printing) has larger quantities
    'flyers': [50, 100, 250, 500, 1000, 2500, 5000],
    'affiches': [10, 25, 50, 100, 250, 500],
    'dépliants': [50, 100, 250, 500, 1000, 2500],
    'cartes de visite': [100, 250, 500, 1000, 2000],
    'carte-de-visite': [100, 250, 500, 1000, 2000],
    'papier entête': [50, 100, 250, 500, 1000],
    'papier': [50, 100, 250, 500, 1000, 2500],
    
    // Vinyl categories
    'vinyl': [10, 25, 50, 100, 250, 500],
    'autocollants': [10, 25, 50, 100, 250, 500],
    'vinyles adhésifs': [5, 10, 25, 50, 100, 250],
    'bâches': [1, 2, 5, 10, 25, 50],
    
    // Panneaux categories
    'panneaux': [1, 2, 5, 10, 25, 50],
    'panneaux extérieurs': [1, 2, 5, 10, 25, 50],
    'supports rigides': [1, 2, 5, 10, 25, 50],
    'plv': [1, 2, 5, 10, 25, 50],
    
    // Enseignes categories
    'enseignes': [1, 2, 3, 5, 10],
    'enseignes lumineuses': [1, 2, 3, 5, 10],
    'totems': [1, 2, 3, 5, 10],
    'lettres découpées': [1, 2, 3, 5, 10, 25],
    
    // Vehicules categories
    'vehicules': [1, 2, 5, 10],
    'covering': [1, 2, 3, 5],
    'lettrage': [1, 2, 5, 10],
    'stickers': [10, 25, 50, 100, 250],
    'magnétiques': [1, 2, 5, 10, 25],
    
    // Textile usually ordered in smaller quantities
    't-shirts': [1, 5, 10, 25, 50, 100, 250],
    'polos': [1, 5, 10, 25, 50, 100],
    'sweats': [1, 5, 10, 25, 50, 100],
    'vestes': [1, 5, 10, 25, 50],
    'casquettes': [1, 5, 10, 25, 50, 100],
    'textile': [1, 5, 10, 25, 50, 100, 250],
    
    // Bijoux usually ordered in very small quantities
    'bijoux': [1, 2, 5, 10, 25, 50],
    'colliers': [1, 2, 5, 10, 25, 50],
    'bracelets': [1, 2, 5, 10, 25, 50],
    'boucles d\'oreilles': [1, 2, 5, 10, 25, 50],
    'pendentifs': [1, 2, 5, 10, 25, 50],
    
    // Accessoires 
    'accessoires': [1, 2, 5, 10, 25, 50, 100],
    'mugs': [1, 2, 5, 10, 25, 50, 100],
    'coques téléphone': [1, 2, 5, 10, 25, 50],
    'badges': [10, 25, 50, 100, 250, 500],
    'porte-clés': [1, 5, 10, 25, 50, 100],
    
    // Ustensiles
    'ustensiles': [1, 2, 5, 10, 25, 50],
    'ustensiles de cuisine': [1, 2, 5, 10, 25, 50],
    'plateaux': [1, 2, 5, 10, 25, 50],
    'dessous de verre': [4, 6, 8, 12, 24, 48],
    'sets de table': [1, 2, 4, 6, 8, 12],
    
    // Emballage
    'emballage': [10, 25, 50, 100, 250, 500],
    'boîtes personnalisées': [10, 25, 50, 100, 250, 500],
    'papier cadeau': [1, 2, 5, 10, 25, 50],
    'étiquettes': [50, 100, 250, 500, 1000],
    'rubans': [1, 2, 5, 10, 25, 50],
    
    // Default quantity options
    'default': [1, 2, 5, 10, 25, 50, 100]
  };
  
  return quantityOptionsMap[category] || quantityOptionsMap['default'];
};

// Extract variant options from product data
export const extractVariantOptionsFromProduct = async (product: Product): Promise<Record<string, string[]>> => {
  const result: Record<string, string[]> = {};
  
  // Check for variant fields in the product itself first
  const variantFields = [
    "size", "color", "format", "quantite", "bat", "poids",
    "echantillon", "types_impression", "type_de_materiaux",
    "details_impression", "orientation_impression"
  ];
  
  // First collect all unique values from the variants
  if (product.variants && product.variants.length > 0) {
    for (const field of variantFields) {
      const uniqueValues = new Set<string>();
      
      // Check each variant for this field
      product.variants.forEach(variant => {
        const value = (variant as any)[field];
        if (value) {
          uniqueValues.add(value);
        }
      });
      
      // If we found values, add them to the result
      if (uniqueValues.size > 0) {
        result[field] = Array.from(uniqueValues);
      }
    }
  }
  
  // If no variants or no values found in variants, check the product itself
  for (const field of variantFields) {
    if (!result[field] || result[field].length === 0) {
      const value = (product as any)[field];
      if (value) {
        result[field] = [value];
      }
    }
  }
  
  // Ajouter des valeurs par défaut pour certaines catégories si aucune valeur n'est trouvée
  if (product.category) {
    const category = product.category.toLowerCase();
    
    // Tailles pour les produits textiles
    if ((category === 'textile' || category === 't-shirts' || category === 'sweats') && (!result['size'] || result['size'].length === 0)) {
      result['size'] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    }
    
    // Couleurs pour les produits textiles
    if ((category === 'textile' || category === 't-shirts' || category === 'sweats') && (!result['color'] || result['color'].length === 0)) {
      result['color'] = ['Blanc', 'Noir', 'Bleu', 'Rouge', 'Vert'];
    }
    
    // Formats pour les produits papier
    if ((category === 'papier' || category === 'flyers' || category === 'affiches') && (!result['format'] || result['format'].length === 0)) {
      result['format'] = ['A6', 'A5', 'A4', 'A3', 'A2'];
    }
    
    // Types d'impression pour les produits papier
    if ((category === 'papier' || category === 'flyers' || category === 'affiches') && (!result['types_impression'] || result['types_impression'].length === 0)) {
      result['types_impression'] = ['Recto', 'Recto-Verso', 'Quadri recto', 'Quadri recto-verso'];
    }
    
    // Poids pour les produits papier
    if ((category === 'papier' || category === 'flyers' || category === 'affiches') && (!result['poids'] || result['poids'].length === 0)) {
      result['poids'] = ['80g', '100g', '115g', '135g', '170g', '250g', '300g', '350g'];
    }
    
    // Types de matériaux pour les produits bijoux
    if ((category === 'bijoux' || category === 'colliers' || category === 'bracelets') && (!result['type_de_materiaux'] || result['type_de_materiaux'].length === 0)) {
      result['type_de_materiaux'] = ['Argent', 'Or', 'Bois', 'Acier', 'Cuir'];
    }
    
    // Formats pour les produits vinyl
    if ((category === 'vinyl' || category === 'autocollants') && (!result['format'] || result['format'].length === 0)) {
      result['format'] = ['Petit', 'Moyen', 'Grand', 'XL', 'Sur mesure'];
    }
  }
  
  return result;
};
