
// Types for the supplier dashboard
export interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image: string;
  category: string;
  subcategory: string;
  status: string;
  stock: number;
  created_at: string;
  description?: string;
  is_customizable?: boolean;
  supplier_id?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: string;
  items: number;
}

export interface Stat {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
}

export interface ProFeature {
  title: string;
  description: string;
  icon: React.ElementType;
}
