
import { supabase } from "@/integrations/supabase/client";
import { productCategories, allProducts } from "@/data/productData";
import { categoryVariants, quantityOptions, variantIllustrations } from "@/components/home/ProductOrderForm/utils";

/**
 * Ce script est conçu pour être exécuté manuellement afin d'importer les données
 * existantes dans les tables Supabase.
 * 
 * Avant d'exécuter ce script, assurez-vous que les tables sont créées dans Supabase.
 * 
 * Pour l'exécuter, vous pouvez l'appeler depuis la console du navigateur:
 * import { importAllData } from "./scripts/importProductData"
 * importAllData()
 */

export const importCategories = async () => {
  console.log("Importation des catégories...");

  for (const category of productCategories) {
    const { data, error } = await supabase
      .from('product_categories')
      .insert({
        name: category.title,
        slug: category.id,
        image_url: category.image
      })
      .select();

    if (error) {
      console.error(`Erreur lors de l'importation de la catégorie ${category.title}:`, error);
    } else {
      console.log(`Catégorie importée: ${category.title}`);

      // Importer les sous-catégories
      const categoryId = data[0].id;
      for (const subcategory of category.subcategories) {
        const subcategorySlug = subcategory.toLowerCase().replace(/\s+/g, '-');
        const { error: subcatError } = await supabase
          .from('product_subcategories')
          .insert({
            name: subcategory,
            slug: subcategorySlug,
            category_id: categoryId
          });

        if (subcatError) {
          console.error(`Erreur lors de l'importation de la sous-catégorie ${subcategory}:`, subcatError);
        } else {
          console.log(`Sous-catégorie importée: ${subcategory}`);
        }
      }
    }
  }
};

export const importProducts = async () => {
  console.log("Importation des produits...");

  // D'abord, récupérer les catégories depuis Supabase
  const { data: categories, error: catError } = await supabase
    .from('product_categories')
    .select('*');

  if (catError || !categories) {
    console.error("Erreur lors de la récupération des catégories:", catError);
    return;
  }

  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.slug] = cat.id;
    return acc;
  }, {} as Record<string, string>);

  // Récupérer les sous-catégories
  const { data: subcategories, error: subcatError } = await supabase
    .from('product_subcategories')
    .select('*');

  if (subcatError || !subcategories) {
    console.error("Erreur lors de la récupération des sous-catégories:", subcatError);
    return;
  }

  const subcategoryMap = subcategories.reduce((acc, subcat) => {
    const key = `${subcat.category_id}-${subcat.slug}`;
    acc[key] = subcat.id;
    return acc;
  }, {} as Record<string, string>);

  // Importer les produits
  for (const product of allProducts) {
    const categoryId = categoryMap[product.category];
    if (!categoryId) {
      console.error(`Catégorie non trouvée pour le produit ${product.name}: ${product.category}`);
      continue;
    }

    const subcatSlug = product.subcategory.toLowerCase().replace(/\s+/g, '-');
    const subcategoryId = subcategoryMap[`${categoryId}-${subcatSlug}`];

    const { error } = await supabase
      .from('products')
      .insert({
        name: product.name,
        price: product.price,
        original_price: product.originalPrice,
        image_url: product.image,
        rating: product.rating,
        review_count: product.reviewCount,
        category_id: categoryId,
        subcategory_id: subcategoryId,
        description: product.description || `Description pour ${product.name}`
      });

    if (error) {
      console.error(`Erreur lors de l'importation du produit ${product.name}:`, error);
    } else {
      console.log(`Produit importé: ${product.name}`);
    }
  }
};

export const importVariantTypes = async () => {
  console.log("Importation des types de variantes...");

  // D'abord, récupérer les catégories depuis Supabase
  const { data: categories, error: catError } = await supabase
    .from('product_categories')
    .select('*');

  if (catError || !categories) {
    console.error("Erreur lors de la récupération des catégories:", catError);
    return;
  }

  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.slug] = cat.id;
    return acc;
  }, {} as Record<string, string>);

  // Pour chaque catégorie, importer ses types de variantes
  for (const [categoryKey, variants] of Object.entries(categoryVariants)) {
    const categoryId = categoryMap[categoryKey];
    if (!categoryId) {
      console.error(`Catégorie non trouvée pour les variantes: ${categoryKey}`);
      continue;
    }

    for (const [variantType, options] of Object.entries(variants)) {
      // Insérer le type de variante
      const { data, error } = await supabase
        .from('variant_types')
        .insert({
          name: variantType,
          display_name: getVariantDisplayName(variantType),
          category_id: categoryId
        })
        .select();

      if (error) {
        console.error(`Erreur lors de l'importation du type de variante ${variantType}:`, error);
        continue;
      }

      const variantTypeId = data[0].id;
      console.log(`Type de variante importé: ${variantType}`);

      // Insérer les options de ce type
      for (const option of options as string[]) {
        const { data: optData, error: optError } = await supabase
          .from('variant_options')
          .insert({
            variant_type_id: variantTypeId,
            value: option
          })
          .select();

        if (optError) {
          console.error(`Erreur lors de l'importation de l'option ${option}:`, optError);
        } else {
          console.log(`Option importée: ${option}`);

          // Si nous avons une illustration pour cette variante, l'importer
          const illustrations = (variantIllustrations as any)[categoryKey];
          if (illustrations && illustrations[variantType] && illustrations[variantType][option]) {
            const { error: illError } = await supabase
              .from('variant_illustrations')
              .insert({
                variant_type_id: variantTypeId,
                variant_option_id: optData[0].id,
                image_url: illustrations[variantType][option]
              });

            if (illError) {
              console.error(`Erreur lors de l'importation de l'illustration pour ${option}:`, illError);
            } else {
              console.log(`Illustration importée pour: ${option}`);
            }
          }
        }
      }
    }
  }
};

export const importQuantityOptions = async () => {
  console.log("Importation des options de quantité...");

  // D'abord, récupérer les catégories depuis Supabase
  const { data: categories, error: catError } = await supabase
    .from('product_categories')
    .select('*');

  if (catError || !categories) {
    console.error("Erreur lors de la récupération des catégories:", catError);
    return;
  }

  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.slug] = cat.id;
    return acc;
  }, {} as Record<string, string>);

  // Pour chaque catégorie, importer ses options de quantité
  for (const [categoryKey, quantities] of Object.entries(quantityOptions)) {
    const categoryId = categoryMap[categoryKey];
    if (!categoryId) {
      console.error(`Catégorie non trouvée pour les quantités: ${categoryKey}`);
      continue;
    }

    // Insérer les options de quantité
    for (let i = 0; i < quantities.length; i++) {
      const quantity = quantities[i];
      const { error } = await supabase
        .from('quantity_options')
        .insert({
          category_id: categoryId,
          quantity: quantity,
          display_order: i
        });

      if (error) {
        console.error(`Erreur lors de l'importation de la quantité ${quantity}:`, error);
      } else {
        console.log(`Quantité importée: ${quantity} pour ${categoryKey}`);
      }
    }
  }
};

export const importAllData = async () => {
  // Importer les données dans l'ordre pour respecter les contraintes de clés étrangères
  await importCategories();
  await importProducts();
  await importVariantTypes();
  await importQuantityOptions();
  console.log("Importation terminée !");
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
