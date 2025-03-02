
export interface Color {
  id: string;
  name: string;
  hex: string;
  available: boolean;
}

export interface SizeGuideItem {
  size: string;
  size2?: string;
  a: string;
  b: string;
  c: string;
}

export interface Review {
  id: number;
  author: string;
  date: string;
  rating: number;
  content: string;
}

export interface RelatedProduct {
  id: number;
  name: string;
  price: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  subcategory: string;
  description?: string;
  color?: string;
  date?: string;
  isNew?: boolean;
  customizationViews?: ProductView[];
}

export interface ProductView {
  id: string;
  name: string;
  image: string;
}

export interface CustomizableProduct extends Product {
  views: ProductView[];
  selectedView: string;
  customizationElements: CustomizationElement[];
}

export interface CustomizationElement {
  id: string;
  type: 'text' | 'image';
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  fontSize?: number;
  fontFamily?: string;
  fontStyle?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    alignment?: 'left' | 'center' | 'right';
  };
  color?: string;
}

export interface FontOption {
  id: string;
  name: string;
}

export interface DesignCategory {
  id: string;
  name: string;
  designs: DesignItem[];
}

export interface DesignItem {
  id: string;
  name: string;
  image: string;
  category: string;
}

export type SupplierStatus = 'active' | 'pending' | 'suspended';

export interface Supplier {
  id: string;
  companyName: string;
  contactName?: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
  status: SupplierStatus;
}

export type ProductStatus = 'draft' | 'published' | 'archived';

export interface DatabaseProduct extends Omit<Product, 'rating' | 'reviewCount'> {
  supplierId: string;
  isCustomizable: boolean;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export type VariantStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  color: string;
  hexColor: string;
  stock: number;
  priceAdjustment: number;
  status: VariantStatus;
  createdAt: string;
  updatedAt: string;
}

export interface NavigationItemInfo {
  title: string;
  link: string;
  icon?: React.ComponentType;
  children?: Array<{ title: string; link: string }>;
}

export interface SupplierResponse {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  status: SupplierStatus;
}
