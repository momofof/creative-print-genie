
import { useState, useEffect } from 'react';
import { 
  fetchProducts, 
  fetchVariantTypes, 
  fetchVariantOptions,
  fetchQuantityOptions
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

  return {
    products: products || [],
    isLoadingProducts,
    productsError,
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

    const loadVariantData = async () => {
      setIsLoading(true);
      try {
        // Charger les types de variantes pour cette catégorie
        const types = await fetchVariantTypes(categoryId);
        setVariantTypes(types);

        // Pour chaque type, charger les options
        const optionsMap: Record<string, VariantOption[]> = {};
        for (const type of types) {
          const options = await fetchVariantOptions(type.id);
          optionsMap[type.name] = options;
        }
        setVariantOptions(optionsMap);

        // Charger les options de quantité
        const quantities = await fetchQuantityOptions(categoryId);
        setQuantityOptions(quantities.length > 0 ? quantities : [1, 5, 10, 25, 50, 100]); // Valeurs par défaut si aucune n'est trouvée

        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des données de variantes:', err);
        setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
      } finally {
        setIsLoading(false);
      }
    };

    loadVariantData();
  }, [categoryId]);

  return {
    variantTypes,
    variantOptions,
    quantityOptions,
    isLoading,
    error
  };
};
