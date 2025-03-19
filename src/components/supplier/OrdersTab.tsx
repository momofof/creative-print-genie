
import React, { useEffect, useState } from "react";
import OrdersTable from "./OrdersTable";
import { orderService } from "@/services/orderService";
import { Order } from "@/types/dashboard";

interface OrdersTabProps {
  orders: Order[];
}

const OrdersTab = ({ orders }: OrdersTabProps) => {
  const [realOrders, setRealOrders] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchOrders = async () => {
      const ordersData = await orderService.getOrders();
      
      // Convert Supabase order format to match the Order type in dashboard
      const formattedOrders = ordersData.map(order => ({
        id: order.id,
        customer: order.customer_id || "Client invité",
        date: new Date(order.created_at).toLocaleDateString(),
        total: parseFloat(order.total),
        status: order.status === "completed" ? "delivered" : 
                order.status === "pending" ? "processing" : "shipped",
        items: Array.isArray(order.items) ? order.items.length : 0
      }));
      
      setRealOrders(formattedOrders);
    };
    
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Commandes</h2>
      <OrdersTable orders={realOrders.length > 0 ? realOrders : orders} />
    </div>
  );
};

export default OrdersTab;
