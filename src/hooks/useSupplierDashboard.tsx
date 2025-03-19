
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product, Order, Stat, ProductVariant } from "@/types/dashboard";
import { toast } from "sonner";

export const useSupplierDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
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

  // Fetch products from Supabase
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products_master')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error("Erreur lors de la récupération des produits:", error);
        toast.error("Impossible de charger les produits");
        return [];
      } else {
        // Convert products from new unified format to our interface format
        const formattedProducts = data.map(product => ({
          ...product,
          // Parse variants from JSONB if they exist
          variants: Array.isArray(product.variants) ? product.variants : 
                   typeof product.variants === 'object' ? product.variants : [],
          // Parse customizations from JSONB if they exist
          customizations: Array.isArray(product.customizations) ? product.customizations : 
                         typeof product.customizations === 'object' ? product.customizations : [],
          status: product.status as "draft" | "published" | "archived"
        }));
        
        // Update products state with type assertion
        setProducts(formattedProducts as Product[]);
        
        // Update stats
        updateProductStats(formattedProducts as Product[]);
        
        return formattedProducts as Product[];
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue");
      return [];
    }
  };

  // Simulate orders (to be replaced with a real API)
  const simulateOrders = () => {
    const mockOrders: Order[] = [
      {
        id: "ORD-39285",
        customer: "Jean Dupont",
        date: "2023-09-23",
        total: 79.98,
        status: "delivered",
        items: 2
      },
      {
        id: "ORD-38104",
        customer: "Marie Lambert",
        date: "2023-09-21",
        total: 129.97,
        status: "processing",
        items: 3
      },
      {
        id: "ORD-37490",
        customer: "Thomas Martin",
        date: "2023-09-18",
        total: 49.99,
        status: "shipped",
        items: 1
      }
    ];
    
    setOrders(mockOrders);
    updateOrderStats(mockOrders);
    
    return mockOrders;
  };

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

  // Delete a product
  const deleteProduct = async (productId: string) => {
    try {
      // Display confirmation
      if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
        return false;
      }
      
      // Delete the product from the master table
      const { error } = await supabase
        .from('products_master')
        .delete()
        .eq('id', productId);
        
      if (error) {
        console.error("Erreur lors de la suppression:", error);
        toast.error("Impossible de supprimer le produit");
        return false;
      } else {
        // Update products list
        setProducts(products.filter(product => product.id !== productId));
        toast.success("Produit supprimé avec succès");
        return true;
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue");
      return false;
    }
  };

  // Load all data
  const loadDashboardData = async () => {
    setIsLoading(true);
    await fetchProducts();
    simulateOrders();
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
