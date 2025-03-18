
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsCards from "@/components/supplier/StatsCards";
import AnalyticsTab from "@/components/supplier/AnalyticsTab";
import OrdersTab from "@/components/supplier/OrdersTab";
import { useSupplierDashboard } from "@/hooks/useSupplierDashboard";
import ProductsTab from "@/components/supplier/ProductsTab";
import DashboardSidebar from "@/components/supplier/dashboard/DashboardSidebar";
import MobileHeader from "@/components/supplier/dashboard/MobileHeader";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { 
    isLoading, 
    products, 
    orders, 
    stats, 
    fetchProducts, 
    deleteProduct, 
    loadDashboardData 
  } = useSupplierDashboard();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const { data, error } = await fetch('/api/auth/check').then(res => res.json());
      if (error || !data.authenticated) {
        toast.error("Vous devez être connecté pour accéder à cette page");
        navigate("/login");
      }
    } catch (error) {
      navigate("/login");
    }
  };

  const handleAddProduct = () => {
    navigate("/supplier/product/new");
  };

  const handleEditProduct = (productId: string) => {
    navigate(`/supplier/product/edit/${productId}`);
  };

  const handleDeleteProduct = async (productId: string) => {
    const success = await deleteProduct(productId);
    if (success) {
      // Already shows a success toast in the hook
    }
  };

  const handleRefreshProducts = () => {
    loadDashboardData();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <DashboardSidebar 
        currentTab={tab} 
        onTabChange={setTab} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <MobileHeader onOpenSidebar={() => setSidebarOpen(true)} />
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <Tabs value={tab} onValueChange={setTab} className="space-y-8">
              <div className="hidden md:block">
                <TabsList className="grid grid-cols-3 w-full max-w-md">
                  <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                  <TabsTrigger value="products">Produits</TabsTrigger>
                  <TabsTrigger value="orders">Commandes</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="space-y-8">
                <StatsCards stats={stats} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Add overview components here */}
                </div>
              </TabsContent>

              <TabsContent value="products">
                <ProductsTab 
                  products={products} 
                  onAddProduct={handleAddProduct}
                  onEditProduct={handleEditProduct}
                  onDeleteProduct={handleDeleteProduct}
                  onRefreshProducts={handleRefreshProducts}
                />
              </TabsContent>

              <TabsContent value="analytics">
                <AnalyticsTab />
              </TabsContent>

              <TabsContent value="orders">
                <OrdersTab orders={orders} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
