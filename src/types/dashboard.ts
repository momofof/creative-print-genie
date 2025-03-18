
export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  original_price?: number;
  image: string;
  stock: number;
  status: 'published' | 'draft' | 'archived';
  date: string;
}

export interface ProductVariant {
  id?: string;
  size: string;
  color: string;
  hex_color: string;
  stock: number;
  price_adjustment: number | null;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  isNew?: boolean;
  isDeleted?: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  customer?: {
    name: string;
    email: string;
  };
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items?: {
    id: string;
    product: {
      name: string;
      image: string;
    };
    quantity: number;
    price: number;
  }[];
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
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface Customization {
  id: string;
  name: string;
  description: string;
  type: string;
  position: string;
  price_adjustment: number;
  is_required: boolean;
}

// New chart data interfaces
export interface ChartData {
  name: string;
  value: number;
}

export interface MultiSeriesChartData {
  name: string;
  [key: string]: number | string;
}

export interface SalesData {
  date: string;
  amount: number;
}

export interface CategorySalesData {
  category: string;
  sales: number;
}

export interface InventoryStatusData {
  status: string;
  count: number;
}
