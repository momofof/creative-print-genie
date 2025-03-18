
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";

// Récupérer toutes les catégories de produits
export const fetchCategories = async () => {
  // Since product_categories table doesn't exist in the current schema,
  // we'll return mock data
  return [
    { id: 'textile', name: 'Textile', slug: 'textile', image: '/lovable-uploads/1365a433-cc0b-4382-8d64-0402ccf2eccd.png' },
    { id: 'papier', name: 'Papier', slug: 'papier', image: '/lovable-uploads/37a81eff-34b6-47cc-b819-69f72dfebbde.png' },
    { id: 'vinyl', name: 'Vinyle', slug: 'vinyl', image: '/lovable-uploads/5c3e6357-3bff-4033-85a4-fc23513fc793.png' },
    { id: 'accessoires', name: 'Accessoires', slug: 'accessoires', image: '/lovable-uploads/65ec5eab-d704-46ee-823c-35a148087669.png' },
    { id: 'emballage', name: 'Emballage', slug: 'emballage', image: '/lovable-uploads/694400ee-4ddd-4bce-8e5e-3941e06b6777.png' }
  ];
};

// Récupérer les sous-catégories d'une catégorie
export const fetchSubcategories = async (categoryId: string) => {
  // Since product_subcategories table doesn't exist in the current schema,
  // we'll return mock data based on the category
  const subcategoriesMap: Record<string, Array<{ id: string, name: string, slug: string, category_id: string }>> = {
    'textile': [
      { id: 'tshirts', name: 'T-shirts', slug: 'tshirts', category_id: 'textile' },
      { id: 'sweats', name: 'Sweats', slug: 'sweats', category_id: 'textile' },
      { id: 'casquettes', name: 'Casquettes', slug: 'casquettes', category_id: 'textile' }
    ],
    'papier': [
      { id: 'flyers', name: 'Flyers', slug: 'flyers', category_id: 'papier' },
      { id: 'affiches', name: 'Affiches', slug: 'affiches', category_id: 'papier' },
      { id: 'cartes', name: 'Cartes de visite', slug: 'cartes', category_id: 'papier' }
    ],
    // Add other categories as needed
  };
  
  return subcategoriesMap[categoryId] || [];
};

// Récupérer tous les produits ou les produits d'une catégorie
export const fetchProducts = async (categoryId?: string) => {
  // We are using the actual products table from Supabase
  let query = supabase
    .from('products')
    .select('*');
  
  if (categoryId) {
    query = query.eq('category', categoryId);
  }
  
  const { data, error } = await query;

  if (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return [];
  }
  
  // Transform data to match the Product interface
  return data?.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    originalPrice: item.original_price,
    image: item.image || '',
    rating: 4.5, // Default values since these columns don't exist
    reviewCount: 10, // Default values since these columns don't exist
    category: item.category,
    subcategory: item.subcategory || '',
    description: item.description
  } as Product)) || [];
};

// Mock functions for variant data since the tables don't exist yet
export const fetchVariantTypes = async (categoryId: string) => {
  console.log('Fetching variant types for category:', categoryId);
  // Return mock data
  return [
    { id: '1', name: 'sizes', display_name: 'Taille', category_id: categoryId },
    { id: '2', name: 'colors', display_name: 'Couleur', category_id: categoryId },
    { id: '3', name: 'materials', display_name: 'Matériau', category_id: categoryId }
  ];
};

export const fetchVariantOptions = async (variantTypeId: string) => {
  console.log('Fetching variant options for type:', variantTypeId);
  // Return mock data based on variant type
  const optionsMap: Record<string, Array<{ id: string, variant_type_id: string, value: string }>> = {
    '1': [ // sizes
      { id: '1', variant_type_id: '1', value: 'S' },
      { id: '2', variant_type_id: '1', value: 'M' },
      { id: '3', variant_type_id: '1', value: 'L' },
      { id: '4', variant_type_id: '1', value: 'XL' }
    ],
    '2': [ // colors
      { id: '5', variant_type_id: '2', value: 'Rouge' },
      { id: '6', variant_type_id: '2', value: 'Bleu' },
      { id: '7', variant_type_id: '2', value: 'Vert' },
      { id: '8', variant_type_id: '2', value: 'Noir' }
    ],
    '3': [ // materials
      { id: '9', variant_type_id: '3', value: 'Coton' },
      { id: '10', variant_type_id: '3', value: 'Polyester' },
      { id: '11', variant_type_id: '3', value: 'Laine' }
    ]
  };
  
  return optionsMap[variantTypeId] || [];
};

export const fetchVariantIllustration = async (variantTypeId: string, variantOptionId: string) => {
  console.log('Fetching illustration for variant:', variantTypeId, variantOptionId);
  // Return mock image URL
  return null; // No illustration by default
};

export const fetchQuantityOptions = async (categoryId: string) => {
  console.log('Fetching quantity options for category:', categoryId);
  // Return default quantities
  return [1, 5, 10, 25, 50, 100];
};
