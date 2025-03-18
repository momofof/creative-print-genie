
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/profile/LoadingSpinner";

// Import dashboard components
import DashboardHeader from "@/components/supplier/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/supplier/dashboard/DashboardSidebar";
import MobileHeader from "@/components/supplier/dashboard/MobileHeader";
import StatsOverview from "@/components/supplier/dashboard/StatsOverview";
import RecentProducts from "@/components/supplier/dashboard/RecentProducts";
import QuickActions from "@/components/supplier/dashboard/QuickActions";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
}

interface SupplierStats {
  totalProducts: number;
  productsInStock: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}

const SupplierDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<SupplierStats>({
    totalProducts: 0,
    productsInStock: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication();
    fetchProducts();
    fetchStats();
  }, []);

  const checkAuthentication = async () => {
    const { data } = await supabase.auth.getSession();
    
    if (!data.session) {
      toast.error("Vous devez être connecté pour accéder au tableau de bord");
      navigate("/login");
    } else {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) return;
      
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("supplier_id", userData.user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      setProducts(data || []);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      toast.error("Erreur lors du chargement des produits");
    }
  };

  const fetchStats = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) return;
      
      // Get total products
      const { count: totalCount, error: totalError } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("supplier_id", userData.user.id);
      
      if (totalError) throw totalError;
      
      // Get product variants stats
      const { data: variantsData, error: variantsError } = await supabase
        .from("product_variants")
        .select("status")
        .in("product_id", products.map(p => p.id));
      
      if (variantsError) throw variantsError;
      
      // Calculate stats based on product variants
      const inStock = variantsData?.filter(v => v.status === 'in_stock').length || 0;
      const lowStock = variantsData?.filter(v => v.status === 'low_stock').length || 0;
      const outOfStock = variantsData?.filter(v => v.status === 'out_of_stock').length || 0;
      
      setStats({
        totalProducts: totalCount || 0,
        productsInStock: inStock,
        lowStockProducts: lowStock,
        outOfStockProducts: outOfStock
      });
    } catch (error: any) {
      console.error("Error fetching stats:", error);
      toast.error("Erreur lors du chargement des statistiques");
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast.success("Déconnexion réussie");
      navigate("/");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar onSignOut={handleSignOut} />
      
      {/* Mobile header */}
      <MobileHeader />
      
      {/* Main content */}
      <div className="flex-1 p-8 md:p-10 pt-20 md:pt-10">
        <DashboardHeader />
        
        {/* Stats */}
        <StatsOverview stats={stats} />
        
        {/* Recent products */}
        <RecentProducts products={products} />
        
        {/* Quick actions */}
        <QuickActions />
      </div>
    </div>
  );
};

export default SupplierDashboard;
