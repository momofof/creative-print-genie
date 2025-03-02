
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
}
