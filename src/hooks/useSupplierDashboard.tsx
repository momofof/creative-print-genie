import { useState, useEffect } from "react";
import { Product, Order, Stat, SalesData, CategorySalesData, InventoryStatusData, MultiSeriesChartData } from "@/types/dashboard";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

  // Données de vente pour les graphiques
  const [salesData, setSalesData] = useState<SalesData[]>([
    { date: "Jan", amount: 0 },
    { date: "Fev", amount: 0 },
    { date: "Mar", amount: 0 },
    { date: "Avr", amount: 0 },
    { date: "Mai", amount: 0 },
    { date: "Juin", amount: 0 },
  ]);

  // Données de vente par catégorie
  const [categorySalesData, setCategorySalesData] = useState<CategorySalesData[]>([
    { category: "T-shirts", sales: 0 },
    { category: "Sweats", sales: 0 },
    { category: "Casquettes", sales: 0 },
    { category: "Accessoires", sales: 0 },
  ]);

  // Données de statut d'inventaire
  const [inventoryStatusData, setInventoryStatusData] = useState<InventoryStatusData[]>([
    { status: "En stock", count: 0 },
    { status: "Stock faible", count: 0 },
    { status: "Rupture de stock", count: 0 },
  ]);

  // Données de performance des produits
  const [productPerformanceData, setProductPerformanceData] = useState<MultiSeriesChartData[]>([
    { name: "Produit A", ventes: 0, vues: 0 },
    { name: "Produit B", ventes: 0, vues: 0 },
    { name: "Produit C", ventes: 0, vues: 0 },
    { name: "Produit D", ventes: 0, vues: 0 },
  ]);

  // Charger les données au chargement du composant
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Récupérer les produits du fournisseur depuis la base de données
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error("Utilisateur non connecté");
        setIsLoading(false);
        return [];
      }

      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          original_price,
          category,
          subcategory,
          image,
          stock,
          status,
          created_at
        `)
        .eq('supplier_id', userData.user.id);

      if (error) {
        console.error("Erreur lors de la récupération des produits:", error);
        toast.error("Erreur lors de la récupération des produits");
        setIsLoading(false);
        return [];
      }

      // Transformation des données pour correspondre au type Product
      const formattedProducts: Product[] = data.map(product => ({
        id: product.id,
        name: product.name,
        category: product.category,
        subcategory: product.subcategory || '',
        price: product.price,
        original_price: product.original_price || undefined,
        image: product.image || '/placeholder.svg',
        stock: product.stock || 0,
        status: product.status as 'published' | 'draft' | 'archived',
        date: product.created_at
      }));

      setProducts(formattedProducts);
      setIsLoading(false);
      return formattedProducts;
    } catch (error) {
      console.error("Erreur inattendue:", error);
      toast.error("Une erreur inattendue s'est produite");
      setIsLoading(false);
      return [];
    }
  };

  // Supprimer un produit
  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        console.error("Erreur lors de la suppression du produit:", error);
        toast.error("Erreur lors de la suppression du produit");
        return false;
      }

      // Mettre à jour l'état local après la suppression
      setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
      toast.success("Produit supprimé avec succès");
      return true;
    } catch (error) {
      console.error("Erreur inattendue:", error);
      toast.error("Une erreur inattendue s'est produite");
      return false;
    }
  };

  // Générer des données de démonstration pour les graphiques
  const generateMockChartData = (products: Product[]) => {
    if (products.length === 0) return;
    
    // Données de vente pour les 6 derniers mois
    const mockSalesData: SalesData[] = [
      { date: "Jan", amount: Math.floor(Math.random() * 5000) + 1000 },
      { date: "Fev", amount: Math.floor(Math.random() * 5000) + 1000 },
      { date: "Mar", amount: Math.floor(Math.random() * 5000) + 1000 },
      { date: "Avr", amount: Math.floor(Math.random() * 5000) + 1000 },
      { date: "Mai", amount: Math.floor(Math.random() * 5000) + 1000 },
      { date: "Juin", amount: Math.floor(Math.random() * 5000) + 1000 },
    ];
    setSalesData(mockSalesData);

    // Extraire les catégories uniques des produits
    const categories = [...new Set(products.map(p => p.category))];
    const mockCategorySalesData: CategorySalesData[] = categories.length 
      ? categories.map(category => ({
          category,
          sales: Math.floor(Math.random() * 10000) + 500
        }))
      : [
          { category: "T-shirts", sales: Math.floor(Math.random() * 10000) + 500 },
          { category: "Sweats", sales: Math.floor(Math.random() * 8000) + 500 },
          { category: "Casquettes", sales: Math.floor(Math.random() * 5000) + 500 },
          { category: "Accessoires", sales: Math.floor(Math.random() * 3000) + 500 },
        ];
    setCategorySalesData(mockCategorySalesData);

    // Données d'inventaire
    const inStock = products.filter(p => p.stock > 5).length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5).length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    
    const mockInventoryStatusData: InventoryStatusData[] = [
      { status: "En stock", count: inStock || Math.floor(Math.random() * 20) + 10 },
      { status: "Stock faible", count: lowStock || Math.floor(Math.random() * 10) + 5 },
      { status: "Rupture de stock", count: outOfStock || Math.floor(Math.random() * 5) + 2 },
    ];
    setInventoryStatusData(mockInventoryStatusData);

    // Données de performance des produits (top 5)
    const topProducts = products.slice(0, 5);
    const mockProductPerformanceData: MultiSeriesChartData[] = topProducts.length 
      ? topProducts.map(product => ({
          name: product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name,
          ventes: Math.floor(Math.random() * 5000) + 500,
          vues: Math.floor(Math.random() * 10000) + 1000,
        }))
      : [
          { name: "T-shirt Basic", ventes: 4500, vues: 9000 },
          { name: "Sweat à capuche", ventes: 3800, vues: 7500 },
          { name: "Casquette logo", ventes: 2900, vues: 6000 },
          { name: "T-shirt design", ventes: 2200, vues: 5500 },
          { name: "Accessoire", ventes: 1500, vues: 3000 },
        ];
    setProductPerformanceData(mockProductPerformanceData);
  };

  // Charger toutes les données du tableau de bord
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Charger les produits
      const products = await fetchProducts();
      
      // Générer des données de graphiques de démonstration
      generateMockChartData(products);
      
      // Mettre à jour les statistiques basées sur les produits
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('status')
          .eq('supplier_id', userData.user.id);

        if (!productsError && productsData) {
          const totalProducts = productsData.length;
          const activeProducts = productsData.filter(p => p.status === 'published').length;
          
          setStats(prev => {
            const newStats = [...prev];
            newStats[2].value = `${activeProducts}`;
            newStats[2].change = `+${activeProducts}`;
            
            // Mettre à jour les statistiques de vente avec des données fictives
            newStats[0].value = `${Math.floor(Math.random() * 50000) + 5000} €`;
            newStats[0].change = `+${Math.floor(Math.random() * 20) + 5}%`;
            
            newStats[1].value = `${Math.floor(Math.random() * 100) + 10}`;
            newStats[1].change = `+${Math.floor(Math.random() * 30) + 5}%`;
            
            newStats[3].value = `${Math.floor(Math.random() * 10) + 2}%`;
            newStats[3].change = `+${Math.floor(Math.random() * 5)}%`;
            
            return newStats;
          });
        }
      }
      
      // Note: En l'absence d'une table de commandes, nous gardons les commandes comme un tableau vide
      setOrders([]);
      
      setIsLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des données du tableau de bord:", error);
      toast.error("Erreur lors du chargement des données");
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    products,
    orders,
    stats,
    salesData,
    categorySalesData,
    inventoryStatusData,
    productPerformanceData,
    fetchProducts,
    deleteProduct,
    loadDashboardData
  };
};
