
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCards from "./StatsCards";
import OrdersTable from "./OrdersTable";
import { Stat, Order } from "@/types/dashboard";

interface OverviewTabProps {
  stats: Stat[];
  orders: Order[];
  onViewAllOrders: () => void;
}

const OverviewTab = ({ stats, orders, onViewAllOrders }: OverviewTabProps) => {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Commandes récentes</CardTitle>
          <CardDescription>
            Les {orders.length} dernières commandes passées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrdersTable orders={orders} isCompact={true} />
        </CardContent>
        <CardFooter>
          <button 
            onClick={onViewAllOrders}
            className="w-full py-2 px-4 bg-transparent border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Voir toutes les commandes
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OverviewTab;
