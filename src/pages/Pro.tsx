
import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useSupplierDashboard } from "@/hooks/useSupplierDashboard";
import { useProfileData } from "@/hooks/useProfileData";
import LoadingSpinner from "@/components/profile/LoadingSpinner";
import OverviewTab from "@/components/supplier/OverviewTab";
import ProductsTab from "@/components/supplier/ProductsTab";
import OrdersTab from "@/components/supplier/OrdersTab";
import AnalyticsTab from "@/components/supplier/AnalyticsTab";
import FeaturesSection from "@/components/supplier/FeaturesSection";
import { ProFeature } from "@/types/dashboard";
import { Shield, Star, Settings, Briefcase, Package, LineChart, Truck, Users } from "lucide-react";

const Pro = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { profile, isLoading: profileLoading } = useProfileData();
  const { 
    isLoading, 
    products, 
    orders, 
    stats,
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

  // If loading
  if (isLoading || profileLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tableau de bord Fournisseur</h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/supplier/register")}>
              Inscription Fournisseur
            </Button>
            <Button onClick={handleAddProduct}>
              Ajouter un produit
            </Button>
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
            <AnalyticsTab />
          </TabsContent>
        </Tabs>

        <FeaturesSection features={proFeatures} />
      </div>
    </div>
  );
};

export default Pro;
