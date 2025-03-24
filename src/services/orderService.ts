
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
  // Création d'une commande
  createOrder: async (order: Order): Promise<OrderCreateResponse> => {
    try {
      // Use orders_complete instead of orders
      const { data, error } = await supabase
        .from("orders_complete")
        .insert({
          customer_id: order.customer_id,
          total: order.total,
          status: order.status,
          product_quantity: order.items.length,
          product_price: order.items[0]?.price || 0,
          product_id: order.items[0]?.product_id || "",
          product_name: order.items[0]?.product_name || "",
          product_options: JSON.stringify(order.items[0]?.variants || {}),
          shipping_address_street: order.shipping_address.address,
          shipping_address_city: order.shipping_address.city,
          shipping_address_state: "",
          shipping_address_zip: order.shipping_address.postal_code,
          shipping_address_country: order.shipping_address.country,
          customer_name: order.shipping_address.name
        })
        .select("id")
        .single();
      
      if (error) throw error;
      
      return {
        success: true,
        message: "Commande créée avec succès",
        orderId: data.id
      };
    } catch (error: any) {
      console.error("Erreur lors de la création de la commande:", error);
      return {
        success: false,
        message: error.message || "Erreur lors de la création de la commande"
      };
    }
  },
  
  // Récupération des commandes
  getOrders: async (): Promise<Order[]> => {
    try {
      // Use orders_complete instead of orders
      const { data, error } = await supabase
        .from("orders_complete")
        .select("*")
        .order("created_at", { ascending: false });
      
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
          country: order.shipping_address_country || ""
        },
        created_at: order.created_at
      }));
    } catch (error: any) {
      console.error("Erreur lors de la récupération des commandes:", error);
      toast.error(error.message || "Erreur lors de la récupération des commandes");
      return [];
    }
  }
};
