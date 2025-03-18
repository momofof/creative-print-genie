
import { useState, useEffect } from "react";
import { Product, Order, Stat } from "@/types/dashboard";
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

  // Charger toutes les données du tableau de bord
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Charger les produits
      await fetchProducts();
      
      // Mettre à jour les statistiques basées sur les produits
      // Pour l'instant, nous utilisons des statistiques simples basées sur les produits
      // En production, ces données viendraient d'une requête plus complexe
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
    fetchProducts,
    deleteProduct,
    loadDashboardData
  };
};
