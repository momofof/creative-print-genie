
import { Product as DashboardProduct } from "@/types/dashboard";
import { Product as UIProduct } from "@/types/product";

/**
 * Converts a product from the dashboard format to the UI format
 */
export const convertDashboardToUIProduct = (product: DashboardProduct): UIProduct => {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.original_price || undefined,
    image: product.image || 'https://via.placeholder.com/400x400?text=Image+non+disponible',
    category: product.category,
    subcategory: product.subcategory || '',
    description: product.description || '',
    rating: 5, // Default rating
    reviewCount: 0, // Default review count
    color: '',
    date: product.created_at,
    isNew: false,
    variants: product.variants
  };
};

/**
 * Converts an array of dashboard products to UI products
 */
export const convertDashboardToUIProducts = (products: DashboardProduct[]): UIProduct[] => {
  return products.map(convertDashboardToUIProduct);
};
