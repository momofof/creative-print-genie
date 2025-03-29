
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  variants?: Record<string, string>;
}

export interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  supplier_id?: string; // Add supplier_id to shipping address temporarily
}

export interface Order {
  id?: string;
  customer_id?: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shipping_address: ShippingAddress;
  created_at?: string;
}

export interface OrderCreateResponse {
  success: boolean;
  message: string;
  orderId?: string;
}

export const orderService = {
  // Create order
  createOrder: async (order: Order): Promise<OrderCreateResponse> => {
    try {
      // Préparer les données pour insertion
      const orderData = {
        customer_id: order.customer_id,
        total: order.total,
        status: order.status,
        product_quantity: order.items[0]?.quantity || 0,
        product_price: order.items[0]?.price || 0,
        product_id: order.items[0]?.product_id || "",
        product_name: order.items[0]?.product_name || "",
        product_options: JSON.stringify(order.items[0]?.variants || {}),
        shipping_address_street: order.shipping_address.address,
        shipping_address_city: order.shipping_address.city,
        shipping_address_state: "",
        shipping_address_zip: order.shipping_address.postal_code,
        shipping_address_country: order.shipping_address.country,
        customer_name: order.shipping_address.name,
        supplier_id: order.shipping_address.supplier_id // Use supplier_id from shipping address
      };
      
      // Insérer dans orders_complete
      const { data, error } = await supabase
        .from("orders_complete")
        .insert(orderData)
        .select("id")
        .single();
      
      if (error) {
        console.error("Database error creating order:", error);
        throw new Error(`Erreur de base de données: ${error.message}`);
      }
      
      return {
        success: true,
        message: "Commande créée avec succès",
        orderId: data.id
      };
    } catch (error: any) {
      console.error("Error creating order:", error);
      return {
        success: false,
        message: error.message || "Erreur lors de la création de la commande"
      };
    }
  },
  
  // Get orders
  getOrders: async (userId?: string): Promise<Order[]> => {
    try {
      let query = supabase
        .from("orders_complete")
        .select("*")
        .order("created_at", { ascending: false });
      
      // Si un userId est fourni, filtrer par client
      if (userId) {
        query = query.eq("customer_id", userId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Map the orders_complete data to our Order interface
      return data.map((order: any) => ({
        id: order.id,
        customer_id: order.customer_id,
        customer_name: order.customer_name,
        total: order.total,
        status: order.status,
        items: [{
          product_id: order.product_id,
          product_name: order.product_name,
          quantity: order.product_quantity || 1,
          price: order.product_price,
          variants: order.product_options ? JSON.parse(order.product_options) : {}
        }],
        shipping_address: {
          name: order.customer_name || "",
          address: order.shipping_address_street || "",
          city: order.shipping_address_city || "",
          postal_code: order.shipping_address_zip || "",
          country: order.shipping_address_country || "",
          supplier_id: order.supplier_id
        },
        created_at: order.created_at
      }));
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      toast.error(error.message || "Error fetching orders");
      return [];
    }
  },
  
  // Update order status
  updateOrderStatus: async (orderId: string, status: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("orders_complete")
        .update({ status })
        .eq("id", orderId);
      
      if (error) throw error;
      
      return true;
    } catch (error: any) {
      console.error("Error updating order status:", error);
      toast.error(error.message || "Error updating order status");
      return false;
    }
  }
};
