
import { useState, useEffect } from 'react';
import { 
  fetchProducts, 
  fetchCategories, 
  fetchSubcategories
} from '@/services/productService';
import { Product } from '@/types/product';
import { useQuery } from '@tanstack/react-query';

export interface VariantType {
  id: string;
  name: string;
  display_name: string;
  category_id: string;
}

export interface VariantOption {
  id: string;
  variant_type_id: string;
  value: string;
}

export const useProductData = () => {
  // Récupérer tous les produits
  const { 
    data: products, 
    isLoading: isLoadingProducts, 
    error: productsError 
  } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(),
  });

  // Récupérer les catégories
  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: categoriesError
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchCategories(),
  });

  return {
    products: products || [],
    categories: categories || [],
    isLoadingProducts,
    isLoadingCategories,
    productsError,
    categoriesError
  };
};

export const useProductVariants = (categoryId: string | undefined) => {
  const [variantTypes, setVariantTypes] = useState<VariantType[]>([]);
  const [variantOptions, setVariantOptions] = useState<Record<string, VariantOption[]>>({});
  const [quantityOptions, setQuantityOptions] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!categoryId) return;

    // For now, we're using hardcoded variant types and options since the tables don't exist
    // This will be replaced with actual API calls when the tables are created
    setIsLoading(true);
    
    try {
      // Simulate variant types
      const mockVariantTypes: VariantType[] = [
        { id: '1', name: 'sizes', display_name: 'Taille', category_id: categoryId },
        { id: '2', name: 'colors', display_name: 'Couleur', category_id: categoryId },
        { id: '3', name: 'materials', display_name: 'Matériau', category_id: categoryId }
      ];
      
      setVariantTypes(mockVariantTypes);
      
      // Simulate variant options
      const mockVariantOptions: Record<string, VariantOption[]> = {
        'sizes': [
          { id: '1', variant_type_id: '1', value: 'S' },
          { id: '2', variant_type_id: '1', value: 'M' },
          { id: '3', variant_type_id: '1', value: 'L' },
          { id: '4', variant_type_id: '1', value: 'XL' }
        ],
        'colors': [
          { id: '5', variant_type_id: '2', value: 'Rouge' },
          { id: '6', variant_type_id: '2', value: 'Bleu' },
          { id: '7', variant_type_id: '2', value: 'Vert' },
          { id: '8', variant_type_id: '2', value: 'Noir' }
        ],
        'materials': [
          { id: '9', variant_type_id: '3', value: 'Coton' },
          { id: '10', variant_type_id: '3', value: 'Polyester' },
          { id: '11', variant_type_id: '3', value: 'Laine' }
        ]
      };
      
      setVariantOptions(mockVariantOptions);
      
      // Simulate quantity options
      setQuantityOptions([1, 5, 10, 25, 50, 100]);
      
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des données de variantes:', err);
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
    } finally {
      setIsLoading(false);
    }
  }, [categoryId]);

  return {
    variantTypes,
    variantOptions,
    quantityOptions,
    isLoading,
    error
  };
};
