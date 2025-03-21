
import { useState, useEffect } from "react";
import { useProducts } from "./useProducts";
import { useOrders } from "./useOrders";
import { useStats } from "./useStats";

export const useSupplierDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Use the smaller hooks
  const { products, fetchProducts, deleteProduct } = useProducts();
  const { orders, simulateOrders } = useOrders();
  const { stats, updateProductStats, updateOrderStats } = useStats();

  // Load all data
  const loadDashboardData = async () => {
    setIsLoading(true);
    const fetchedProducts = await fetchProducts();
    const mockOrders = simulateOrders();
    
    // Update stats based on fetched data
    updateProductStats(fetchedProducts);
    updateOrderStats(mockOrders);
    
    setIsLoading(false);
  };

  // Initial data loading
  useEffect(() => {
    loadDashboardData();
  }, []);

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
