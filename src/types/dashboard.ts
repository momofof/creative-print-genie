
export interface Stat {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  price: number;
  original_price?: number;
  stock: number;
  image?: string;
  status: "published" | "draft" | "archived";
  supplier_id: string;
  is_customizable?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: number;
}

export interface ProFeature {
  title: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface Customization {
  id: string;
  product_id: string;
  name: string;
  type: "text" | "image";
  position: "front" | "back" | "sleeve" | "collar";
  description?: string;
  price_adjustment: number;
  is_required: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CustomerCustomization {
  id: string;
  customization_id: string;
  user_id?: string;
  content?: string;
  image_path?: string;
  created_at: string;
}
