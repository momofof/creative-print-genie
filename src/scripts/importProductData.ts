import { supabase } from "@/integrations/supabase/client";
import { productCategories, allProducts } from "@/data/productData";

/**
 * Ce script est conçu pour être exécuté manuellement afin d'importer les données
 * existantes dans les tables Supabase.
 * 
 * NOTE IMPORTANTE: Ce script n'est que partiellement fonctionnel car certaines tables
 * nécessaires n'existent pas encore dans Supabase. Les fonctions pour ces tables
 * sont commentées et seront activées une fois les tables créées.
 * 
 * Pour l'exécuter, vous pouvez l'appeler depuis la console du navigateur:
 * import { importAllData } from "./scripts/importProductData"
 * importAllData()
 */

export const importCategories = async () => {
  console.log("Cette fonction sera implémentée quand la table product_categories sera créée dans Supabase.");
  // Cette fonction est désactivée car la table n'existe pas encore
};

export const importProducts = async () => {
  try {
    console.log("Importing products into Supabase...");
    
    for (const product of allProducts) {
      // Existing products table is available in Supabase
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          price: product.price,
          original_price: product.originalPrice,
          image: product.image,
          category: product.category,
          subcategory: product.subcategory,
          supplier_id: '00000000-0000-0000-0000-000000000000', // Default supplier ID (required)
          is_customizable: false
        })
        .select();
      
      if (error) {
        console.error(`Error importing product ${product.name}:`, error);
      } else {
        console.log(`Imported product: ${product.name}`);
      }
    }
    
    console.log("Product import completed.");
  } catch (error) {
    console.error("Error in importProducts function:", error);
  }
};

export const importVariantTypes = async () => {
  console.log("Cette fonction sera implémentée quand la table variant_types sera créée dans Supabase.");
  // Cette fonction est désactivée car la table n'existe pas encore
};

export const importQuantityOptions = async () => {
  console.log("Cette fonction sera implémentée quand la table quantity_options sera créée dans Supabase.");
  // Cette fonction est désactivée car la table n'existe pas encore
};

export const importAllData = async () => {
  console.log("Importing product data to Supabase...");
  
  // Only import to existing tables
  await importProducts();
  
  console.log("Import completed. Note: Some imports were skipped as tables don't exist yet.");
  console.log("To create the necessary tables, please run the SQL commands that create the variant tables.");
};

// Fonction d'aide pour obtenir le nom d'affichage d'un type de variante
function getVariantDisplayName(variantType: string): string {
  const displayNames: Record<string, string> = {
    sizes: "Taille",
    colors: "Couleur",
    materials: "Matériau",
    styles: "Style",
    thickness: "Épaisseur",
    printDetails: "Détails d'impression",
    paperTypes: "Type de papier",
    folding: "Pliage",
    foldingStyles: "Style de pliage",
    finishes: "Finition",
    techniques: "Technique"
  };
  
  return displayNames[variantType] || variantType;
}
