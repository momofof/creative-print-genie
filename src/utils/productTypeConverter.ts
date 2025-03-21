
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
    image: product.image || '/placeholder.svg',
    category: product.category,
    subcategory: product.subcategory || '',
    description: product.description || '', // S'assurer que la description est bien transmise
    rating: 5, // Default rating
    reviewCount: 0, // Default review count
    date: product.created_at,
    isNew: false,
    variants: product.variants,
    variant_images: product.variant_images
  };
};

/**
 * Converts an array of dashboard products to UI products
 */
export const convertDashboardToUIProducts = (products: DashboardProduct[]): UIProduct[] => {
  return products.map(convertDashboardToUIProduct);
};
