
import { ProductComplete } from "@/types/dashboard";
import { Product } from "@/types/product";

// Convert from Dashboard Product type to UI Product type
export const convertDashboardToUIProducts = (products: ProductComplete[]): Product[] => {
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
    size: product.size,
    format: product.format,
    created_at: product.created_at,
    variants: [
      // Default variant based on main product properties
      {
        id: `default-${product.id}`,
        product_id: product.id,
        size: product.size || undefined,
        color: product.color || undefined,
        hex_color: product.hex_color || undefined,
        stock: product.stock || 0,
        price_adjustment: 0,
        status: product.variant_status || 'in_stock',
        created_at: product.created_at,
        updated_at: product.updated_at
      }
    ]
  }));
};

// Convert from UI Product type to Dashboard Product type
export const convertUIToDashboardProduct = (product: Product): Partial<ProductComplete> => {
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
    color: product.color,
    size: product.size,
    format: product.format,
    created_at: product.created_at
  };
};
