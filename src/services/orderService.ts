
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { toJsonValue } from "@/utils/jsonUtils";

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  variants?: Record<string, string>;
  customizations?: any[];
}

export interface OrderData {
  customer_id?: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shipping_address?: {
    name?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    country?: string;
  };
}

export const orderService = {
  async createOrder(orderData: OrderData): Promise<{ success: boolean; order_id?: string }> {
    try {
      // Convert complex objects to JSON format for Supabase storage
      const formattedOrderData = {
        ...orderData,
        items: toJsonValue(orderData.items),
        shipping_address: orderData.shipping_address ? toJsonValue(orderData.shipping_address) : null,
        created_at: new Date().toISOString()
      };
      
      // Use the new orders table we created
      const { data, error } = await supabase
        .from('orders')
        .insert(formattedOrderData)
        .select('id')
        .single();
        
      if (error) {
        console.error("Error creating order:", error);
        throw error;
      }
      
      return { 
        success: true, 
        order_id: data.id
      };
    } catch (error: any) {
      console.error("Failed to create order:", error);
      toast.error(`Erreur lors de la création de la commande: ${error.message}`);
      return { success: false };
    }
  },
  
  async getOrders(customerId?: string): Promise<any[]> {
    try {
      // Use the new orders table we created
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (customerId) {
        query = query.eq('customer_id', customerId);
      }
        
      const { data, error } = await query;
        
      if (error) {
        throw error;
      }
        
      return data || [];
    } catch (error: any) {
      console.error("Failed to fetch orders:", error);
      toast.error(`Erreur lors de la récupération des commandes: ${error.message}`);
      return [];
    }
  }
};
