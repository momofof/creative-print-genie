
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

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { profile, isLoading: profileLoading } = useProfileData();
  const { 
    isLoading, 
    isSupplier,
    products, 
    orders, 
    stats,
    deleteProduct,
    createProduct
  } = useSupplierDashboard();

  // Navigation handlers
  const handleAddProduct = () => {
    // Now the function will create a new product and navigate to edit page
    createProduct({
      name: "Nouveau produit",
      price: 0,
      category: "Non classé",
      image: "", // Add required fields
      subcategory: "", 
      status: "draft", // Explicitly use the correct enum value
      created_at: new Date().toISOString(), // Convert Date to string ISO format
      description: ""
    }).then(productId => {
      if (productId) {
        navigate(`/supplier/product/${productId}/edit`);
      }
    });
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

        <FeaturesSection features={[
          {
            title: "Gestion des produits",
            description: "Ajoutez, modifiez et organisez facilement vos produits en ligne",
            icon: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
          },
          {
            title: "Suivi des commandes",
            description: "Suivez toutes les commandes et gérez les expéditions efficacement",
            icon: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
          },
          {
            title: "Analyse des ventes",
            description: "Visualisez vos performances et identifiez les tendances commerciales",
            icon: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
          },
          {
            title: "Gestion des clients",
            description: "Accédez aux informations clients et personnalisez votre approche",
            icon: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
          },
        ]} />
      </div>
    </div>
  );
};

export default Dashboard;
