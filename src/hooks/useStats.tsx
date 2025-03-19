
import { useState } from "react";
import { Stat, Product, Order } from "@/types/dashboard";

export const useStats = () => {
  const [stats, setStats] = useState<Stat[]>([
    {
      title: "Ventes Totales",
      value: "0 €",
      change: "+0%",
      changeType: "positive" as const
    },
    {
      title: "Commandes",
      value: "0",
      change: "+0%",
      changeType: "positive" as const
    },
    {
      title: "Produits Actifs",
      value: "0",
      change: "+0",
      changeType: "positive" as const
    },
    {
      title: "Taux de Conversion",
      value: "0%",
      change: "0%",
      changeType: "neutral" as const
    },
  ]);

  // Update product-related stats
  const updateProductStats = (products: Product[]) => {
    const productsCount = products.length;
    
    setStats(prevStats => {
      const newStats = [...prevStats];
      newStats[2] = {
        ...newStats[2],
        value: String(productsCount)
      };
      return newStats;
    });
  };

  // Update order-related stats
  const updateOrderStats = (orders: Order[]) => {
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const ordersCount = orders.length;
    
    setStats(prevStats => {
      const newStats = [...prevStats];
      newStats[0] = {
        ...newStats[0],
        value: `${totalSales.toFixed(2)} €`
      };
      newStats[1] = {
        ...newStats[1],
        value: String(ordersCount)
      };
      return newStats;
    });
  };

  return {
    stats,
    updateProductStats,
    updateOrderStats
  };
};
