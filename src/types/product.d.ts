
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  image: string;
  status: string;
  isCustomizable: boolean;
  variants?: ProductVariant[];
  customization?: ProductCustomization;
}

export interface ProductVariant {
  id: string;
  product_id?: string;
  size?: string | null;
  color?: string | null;
  hex_color?: string | null;
  stock?: number | null;
  price_adjustment?: number | null;
  status?: string | null;
  image_url?: string | null;
  // Attributs supplémentaires
  bat?: string | null;
  poids?: string | null;
  format?: string | null;
  quantite?: string | null;
  echantillon?: string | null;
  typesImpression?: string | null;
  typeDeMateriaux?: string | null;
  detailsImpression?: string | null;
  orientationImpression?: string | null;
}

export interface ProductCustomization {
  name: string;
  type: "text" | "image";
  position?: { x: number; y: number } | null;
  priceAdjustment?: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  variant?: ProductVariant;
  customization?: {
    content: string;
    type: "text" | "image";
  };
  options?: Record<string, string>;
}
