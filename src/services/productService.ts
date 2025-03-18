
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";

// Récupérer toutes les catégories de produits
export const fetchProductCategories = async () => {
  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return [];
  }
  
  return data || [];
};

// Récupérer les sous-catégories d'une catégorie
export const fetchSubcategories = async (categoryId: string) => {
  const { data, error } = await supabase
    .from('product_subcategories')
    .select('*')
    .eq('category_id', categoryId)
    .order('name');

  if (error) {
    console.error('Erreur lors de la récupération des sous-catégories:', error);
    return [];
  }
  
  return data || [];
};

// Récupérer tous les produits ou les produits d'une catégorie
export const fetchProducts = async (categoryId?: string) => {
  let query = supabase
    .from('products')
    .select('*, product_categories(name), product_subcategories(name)');
  
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  
  const { data, error } = await query;

  if (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return [];
  }
  
  // Transformer les données pour correspondre au format attendu par le composant
  return data?.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    originalPrice: item.original_price,
    image: item.image_url,
    rating: item.rating || 0,
    reviewCount: item.review_count || 0,
    category: item.product_categories?.name || '',
    subcategory: item.product_subcategories?.name || '',
    description: item.description
  } as Product)) || [];
};

// Récupérer les types de variantes pour une catégorie
export const fetchVariantTypes = async (categoryId: string) => {
  const { data, error } = await supabase
    .from('variant_types')
    .select('*')
    .eq('category_id', categoryId);

  if (error) {
    console.error('Erreur lors de la récupération des types de variantes:', error);
    return [];
  }
  
  return data || [];
};

// Récupérer les options pour un type de variante
export const fetchVariantOptions = async (variantTypeId: string) => {
  const { data, error } = await supabase
    .from('variant_options')
    .select('*')
    .eq('variant_type_id', variantTypeId);

  if (error) {
    console.error('Erreur lors de la récupération des options de variantes:', error);
    return [];
  }
  
  return data || [];
};

// Récupérer les illustrations pour une variante
export const fetchVariantIllustration = async (variantTypeId: string, variantOptionId: string) => {
  const { data, error } = await supabase
    .from('variant_illustrations')
    .select('*')
    .eq('variant_type_id', variantTypeId)
    .eq('variant_option_id', variantOptionId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = pas de résultat trouvé
    console.error('Erreur lors de la récupération de l\'illustration:', error);
    return null;
  }
  
  return data?.image_url || null;
};

// Récupérer les options de quantité pour une catégorie
export const fetchQuantityOptions = async (categoryId: string) => {
  const { data, error } = await supabase
    .from('quantity_options')
    .select('*')
    .eq('category_id', categoryId)
    .order('display_order');

  if (error) {
    console.error('Erreur lors de la récupération des options de quantité:', error);
    return [];
  }
  
  return data?.map(item => item.quantity) || [];
};
