
import { Product, Order, Stat } from "@/types/dashboard";

export interface SupplierData {
  id: string;
  company_name: string;
  contact_name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  status: "active" | "pending" | "suspended";
}

// Define product status type to match Supabase enum
export type ProductStatus = "draft" | "published" | "archived";

// Define a type for the product without id, supplier_id, and stock
export type CreateProductData = Omit<Product, 'id' | 'supplier_id' | 'stock'> & {
  status?: ProductStatus;
};
