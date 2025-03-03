
import React from "react";
import OrdersTable from "./OrdersTable";
import { Order } from "@/types/dashboard";

interface OrdersTabProps {
  orders: Order[];
}

const OrdersTab = ({ orders }: OrdersTabProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Commandes</h2>
      <OrdersTable orders={orders} />
    </div>
  );
};

export default OrdersTab;
