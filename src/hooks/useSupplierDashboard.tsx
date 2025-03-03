import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product, Order, Stat } from "@/types/dashboard";
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
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;

      if (!userId) {
        console.error("No user ID found");
        return [];
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('supplier_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erreur lors de la récupération des produits:", error);
        toast.error("Impossible de charger les produits");
        return [];
      } else {
        // Cast data to ensure it has all required fields including stock
        const typedProducts = data.map(product => ({
          ...product,
          stock: product.stock || 0
        })) as Product[];
        
        setProducts(typedProducts);
        
        // Update stats
        updateProductStats(typedProducts);
        
        return typedProducts;
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
    const activeProducts = products.filter(p => p.status === "published").length;
    
    setStats(prevStats => {
      const newStats = [...prevStats];
      newStats[2] = {
        ...newStats[2],
        value: String(activeProducts),
        change: `+${productsCount - activeProducts}`,
        changeType: productsCount > activeProducts ? "positive" : "neutral"
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

  // Add a new product
  const addProduct = async (productData: Partial<Product>) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;

      if (!userId) {
        toast.error("Vous devez être connecté pour ajouter un produit");
        return null;
      }

      // Ensure stock is present
      const completeProductData = {
        ...productData,
        supplier_id: userId,
        stock: productData.stock || 0
      };

      const { data, error } = await supabase
        .from('products')
        .insert(completeProductData)
        .select();

      if (error) {
        console.error("Erreur lors de l'ajout du produit:", error);
        toast.error("Impossible d'ajouter le produit");
        return null;
      }

      toast.success("Produit ajouté avec succès");
      await fetchProducts();
      return data[0];
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue");
      return null;
    }
  };

  // Update a product
  const updateProduct = async (productId: string, productData: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', productId)
        .select();

      if (error) {
        console.error("Erreur lors de la mise à jour du produit:", error);
        toast.error("Impossible de mettre à jour le produit");
        return null;
      }

      toast.success("Produit mis à jour avec succès");
      await fetchProducts();
      return data[0];
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue");
      return null;
    }
  };

  // Delete a product
  const deleteProduct = async (productId: string) => {
    try {
      // Display confirmation
      if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
        return false;
      }
      
      // Delete the product
      const { error } = await supabase
        .from('products')
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
    addProduct,
    updateProduct,
    deleteProduct,
    loadDashboardData
  };
};
