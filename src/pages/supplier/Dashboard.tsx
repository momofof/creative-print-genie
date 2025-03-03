
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatsCards from "@/components/supplier/StatsCards";
import OverviewTab from "@/components/supplier/OverviewTab";
import ProductsTab from "@/components/supplier/ProductsTab";
import OrdersTab from "@/components/supplier/OrdersTab";
import AnalyticsTab from "@/components/supplier/AnalyticsTab";
import Navigation from "@/components/Navigation";
import { useSupplierDashboard } from "@/hooks/useSupplierDashboard";

const Pro = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { isLoading, isSupplier, supplierData, products, orders, error } = useSupplierDashboard();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-32 px-4 max-w-6xl mx-auto">
          <div className="flex justify-center items-center h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-32 px-4 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Une erreur s'est produite</CardTitle>
              <CardDescription>
                Nous n'avons pas pu charger vos données de fournisseur.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-red-500">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isSupplier) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-32 px-4 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Espace Fournisseur</CardTitle>
              <CardDescription>
                Vous n'êtes pas encore enregistré en tant que fournisseur.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p>
                Pour vendre des produits sur notre plateforme, vous devez créer un compte fournisseur.
              </p>
              <div>
                <Link to="/supplier/register">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Devenir fournisseur
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-32 px-4 max-w-6xl mx-auto pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Tableau de bord fournisseur</h1>
            <p className="text-muted-foreground">
              Bienvenue, {supplierData?.company_name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/supplier/product/new">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                Ajouter un produit
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCards />
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="orders">Commandes</TabsTrigger>
            <TabsTrigger value="analytics">Analyses</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <ProductsTab products={products} />
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <OrdersTab orders={orders} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <AnalyticsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Pro;
