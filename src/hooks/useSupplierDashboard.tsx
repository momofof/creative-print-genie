
import { useState } from "react";
import { Product, Order, Stat } from "@/types/dashboard";
import { toast } from "sonner";

export const useSupplierDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
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

  // Simplified mock version
  const fetchProducts = async () => {
    setIsLoading(true);
    // Empty implementation since tables are dropped
    setIsLoading(false);
    return [];
  };

  // Simplified mock version
  const deleteProduct = async (productId: string) => {
    // Empty implementation since tables are dropped
    toast.success("Produit supprimé avec succès");
    return true;
  };

  // Simplified mock version
  const loadDashboardData = async () => {
    setIsLoading(true);
    // Empty implementation since tables are dropped
    setIsLoading(false);
  };

  return {
    isLoading,
    products,
    orders,
    stats,
    fetchProducts,
    deleteProduct,
    loadDashboardData
  };
};
