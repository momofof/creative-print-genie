
import { Product, Order, Stat } from "@/types/dashboard";

// Initialize default stats
export const getInitialStats = (): Stat[] => {
  return [
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
  ];
};

// Update product-related stats
export const updateProductStats = (products: Product[], prevStats: Stat[]): Stat[] => {
  const productsCount = products.length;
  const activeProducts = products.filter(p => p.status === "published").length;
  
  const newStats = [...prevStats];
  newStats[2] = {
    ...newStats[2],
    value: String(activeProducts),
    change: `+${productsCount - activeProducts}`,
    changeType: productsCount > activeProducts ? "positive" : "neutral"
  };
  return newStats;
};

// Update order-related stats
export const updateOrderStats = (orders: Order[], prevStats: Stat[]): Stat[] => {
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const ordersCount = orders.length;
  
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
};
