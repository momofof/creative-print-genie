
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Package, LineChart, Truck, Users, UserRound, LogOut } from "lucide-react";
import { ProFeature } from "@/types/dashboard";
import { useSupplierDashboard } from "@/hooks/useSupplierDashboard";
import { useProfileData } from "@/hooks/useProfileData";
import LoadingSpinner from "@/components/profile/LoadingSpinner";
import OverviewTab from "@/components/supplier/OverviewTab";
import ProductsTab from "@/components/supplier/ProductsTab";
import OrdersTab from "@/components/supplier/OrdersTab";
import AnalyticsTab from "@/components/supplier/AnalyticsTab";
import FeaturesSection from "@/components/supplier/FeaturesSection";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Pro = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { profile, isLoading: profileLoading, handleSignOut } = useProfileData();
  const { 
    isLoading, 
    products, 
    orders, 
    stats, 
    salesData,
    categorySalesData,
    inventoryStatusData,
    productPerformanceData,
    deleteProduct
  } = useSupplierDashboard();

  // Dashboard features for the promo section
  const proFeatures: ProFeature[] = [
    {
      title: "Gestion des produits",
      description: "Ajoutez, modifiez et organisez facilement vos produits en ligne",
      icon: Package,
    },
    {
      title: "Suivi des commandes",
      description: "Suivez toutes les commandes et gérez les expéditions efficacement",
      icon: Truck,
    },
    {
      title: "Analyse des ventes",
      description: "Visualisez vos performances et identifiez les tendances commerciales",
      icon: LineChart,
    },
    {
      title: "Gestion des clients",
      description: "Accédez aux informations clients et personnalisez votre approche",
      icon: Users,
    },
  ];

  // Navigation handlers
  const handleAddProduct = () => {
    navigate("/supplier/product/new");
  };

  const handleEditProduct = (productId: string) => {
    navigate(`/supplier/product/${productId}/edit`);
  };

  const handleDeleteProduct = async (productId: string) => {
    await deleteProduct(productId);
  };

  const handleViewAllOrders = () => {
    setActiveTab("orders");
  };

  const onSignOut = async () => {
    await handleSignOut();
    navigate("/");
    toast.success("Déconnexion réussie");
  };

  // If loading or authentication check not completed
  if (isLoading || profileLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tableau de bord Fournisseur</h1>
          <div className="flex items-center gap-3">
            <Button onClick={handleAddProduct}>
              Ajouter un produit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="w-10 h-10 rounded-full"
                >
                  <UserRound className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <UserRound className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSignOut} className="text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="orders">Commandes</TabsTrigger>
            <TabsTrigger value="analytics">Analyses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <OverviewTab 
              stats={stats} 
              orders={orders}
              onViewAllOrders={handleViewAllOrders}
            />
          </TabsContent>
          
          <TabsContent value="products">
            <ProductsTab 
              products={products}
              onAddProduct={handleAddProduct}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          </TabsContent>
          
          <TabsContent value="orders">
            <OrdersTab orders={orders} />
          </TabsContent>
          
          <TabsContent value="analytics">
            <AnalyticsTab 
              salesData={salesData}
              categorySalesData={categorySalesData}
              inventoryStatusData={inventoryStatusData}
              productPerformanceData={productPerformanceData}
            />
          </TabsContent>
        </Tabs>

        <FeaturesSection features={proFeatures} />
      </div>
    </div>
  );
};

export default Pro;
