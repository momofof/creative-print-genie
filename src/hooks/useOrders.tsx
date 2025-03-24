
import { useState, useEffect } from "react";
import { OrderComplete } from "@/types/dashboard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useOrders = () => {
  const [orders, setOrders] = useState<OrderComplete[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders_complete")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      setOrders(data as OrderComplete[]);
      return data as OrderComplete[];
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Erreur lors du chargement des commandes");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Simulation des commandes (pour la démo)
  const simulateOrders = () => {
    const mockOrders: OrderComplete[] = [
      {
        id: "ORD-39285",
        customer_name: "Jean Dupont",
        total: 79.98,
        status: "delivered",
        product_quantity: 2,
        created_at: "2023-09-23"
      },
      {
        id: "ORD-38104",
        customer_name: "Marie Lambert",
        total: 129.97,
        status: "processing",
        product_quantity: 3,
        created_at: "2023-09-21"
      },
      {
        id: "ORD-37490",
        customer_name: "Thomas Martin",
        total: 49.99,
        status: "shipped",
        product_quantity: 1,
        created_at: "2023-09-18"
      }
    ];
    
    setOrders(mockOrders);
    return mockOrders;
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    isLoading,
    fetchOrders,
    simulateOrders
  };
};
