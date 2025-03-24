
import { Product as DashboardProduct } from "@/types/dashboard";
import { Product as UIProduct } from "@/types/product";

// Convert from Dashboard Product type to UI Product type
export const convertDashboardToUIProducts = (products: DashboardProduct[]): UIProduct[] => {
  return products.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: product.original_price,
    image: product.image || undefined,
    category: product.category,
    subcategory: product.subcategory,
    rating: 5, // Default rating
    reviewCount: 0, // Default review count
    isNew: product.created_at ? new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : false,
    is_customizable: product.is_customizable,
    color: product.color,
    created_at: product.created_at
  }));
};

// Convert from UI Product type to Dashboard Product type
export const convertUIToDashboardProduct = (product: UIProduct): Partial<DashboardProduct> => {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    original_price: product.originalPrice,
    image: product.image,
    category: product.category,
    subcategory: product.subcategory,
    is_customizable: product.is_customizable,
    variants: [], // Initialize empty arrays for related data
    customizations: [],
    variantImages: [],
    created_at: product.created_at
  };
};
