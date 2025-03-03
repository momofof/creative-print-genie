
import { useState, useEffect } from "react";
import { Product, Order, Stat } from "@/types/dashboard";
import { fetchProducts, addProduct, updateProduct, deleteProduct } from "@/services/productService";
import { simulateOrders } from "@/services/orderService";
import { getInitialStats, updateProductStats, updateOrderStats } from "@/services/dashboardStatsService";

export const useSupplierDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stat[]>(getInitialStats());

  // Fetch all products from the service
  const fetchAllProducts = async () => {
    const productsList = await fetchProducts();
    setProducts(productsList);
    
    // Update stats
    setStats(prevStats => updateProductStats(productsList, prevStats));
    
    return productsList;
  };

  // Simulate orders using the service
  const fetchAllOrders = () => {
    const ordersList = simulateOrders();
    setOrders(ordersList);
    
    // Update stats
    setStats(prevStats => updateOrderStats(ordersList, prevStats));
    
    return ordersList;
  };

  // Add a new product using the service
  const handleAddProduct = async (productData: Partial<Product>) => {
    const newProduct = await addProduct(productData);
    if (newProduct) {
      await fetchAllProducts();
      return newProduct;
    }
    return null;
  };

  // Update a product using the service
  const handleUpdateProduct = async (productId: string, productData: Partial<Product>) => {
    const updatedProduct = await updateProduct(productId, productData);
    if (updatedProduct) {
      await fetchAllProducts();
      return updatedProduct;
    }
    return null;
  };

  // Delete a product using the service
  const handleDeleteProduct = async (productId: string) => {
    // Display confirmation
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      return false;
    }
    
    const success = await deleteProduct(productId);
    if (success) {
      // Update products list locally (no need to refetch)
      setProducts(products.filter(product => product.id !== productId));
      return true;
    }
    return false;
  };

  // Load all dashboard data
  const loadDashboardData = async () => {
    setIsLoading(true);
    await fetchAllProducts();
    fetchAllOrders();
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
    fetchProducts: fetchAllProducts,
    addProduct: handleAddProduct,
    updateProduct: handleUpdateProduct,
    deleteProduct: handleDeleteProduct,
    loadDashboardData
  };
};
