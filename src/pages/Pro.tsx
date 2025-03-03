
import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import { Shield, Star, Settings, Briefcase, Package, LineChart, Truck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/profile/LoadingSpinner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

// Type pour les produits
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  subcategory: string;
  status: string;
  stock: number;
  created_at: string;
}

// Type pour les commandes
interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: string;
  items: number;
}

const Pro = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  
  // Données fictives pour le tableau de bord
  const products: Product[] = [
    {
      id: "1",
      name: "T-shirt Premium",
      price: 29.99,
      originalPrice: 39.99,
      image: "/placeholder.svg",
      category: "Vêtements",
      subcategory: "T-shirts",
      status: "active",
      stock: 42,
      created_at: "2023-05-15"
    },
    {
      id: "2",
      name: "Sweat à capuche",
      price: 49.99,
      image: "/placeholder.svg",
      category: "Vêtements",
      subcategory: "Sweats",
      status: "active",
      stock: 18,
      created_at: "2023-06-02"
    },
    {
      id: "3",
      name: "Casquette Logo",
      price: 19.99,
      originalPrice: 24.99,
      image: "/placeholder.svg",
      category: "Accessoires",
      subcategory: "Chapeaux",
      status: "low_stock",
      stock: 5,
      created_at: "2023-04-28"
    }
  ];

  const orders: Order[] = [
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

  // Stats pour le tableau de bord
  const stats = [
    {
      title: "Ventes Totales",
      value: "4 280 €",
      change: "+12%",
      changeType: "positive"
    },
    {
      title: "Commandes",
      value: "145",
      change: "+8%",
      changeType: "positive"
    },
    {
      title: "Produits Actifs",
      value: "32",
      change: "+3",
      changeType: "positive"
    },
    {
      title: "Taux de Conversion",
      value: "3.2%",
      change: "-0.5%",
      changeType: "negative"
    },
  ];

  // Rediriger vers le formulaire d'ajout de produit
  const handleAddProduct = () => {
    navigate("/supplier/product/new");
  };

  // Rediriger vers la modification d'un produit
  const handleEditProduct = (productId: string) => {
    navigate(`/supplier/product/${productId}/edit`);
  };

  // Fonctionnalités du tableau de bord
  const proFeatures = [
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

  // Si chargement en cours
  if (isLoading) {
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
          
          <TabsContent value="overview" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium text-gray-500">{stat.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className={`text-sm mt-1 ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} depuis le mois dernier
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Commandes récentes</CardTitle>
                <CardDescription>
                  Les 3 dernières commandes passées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-3 font-medium">Commande</th>
                        <th className="pb-3 font-medium">Client</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium">Montant</th>
                        <th className="pb-3 font-medium">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="py-3">{order.id}</td>
                          <td className="py-3">{order.customer}</td>
                          <td className="py-3">{order.date}</td>
                          <td className="py-3">{order.total.toFixed(2)} €</td>
                          <td className="py-3">
                            <Badge variant={
                              order.status === "delivered" ? "default" :
                              order.status === "processing" ? "secondary" : "outline"
                            }>
                              {order.status === "delivered" ? "Livré" :
                              order.status === "processing" ? "En traitement" : "Expédié"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Voir toutes les commandes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-bold">Mes produits</h2>
              <Button onClick={handleAddProduct}>Ajouter un produit</Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium">Produit</th>
                    <th className="pb-3 font-medium">Catégorie</th>
                    <th className="pb-3 font-medium">Prix</th>
                    <th className="pb-3 font-medium">Stock</th>
                    <th className="pb-3 font-medium">Statut</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-10 h-10 object-cover rounded-md"
                          />
                          <span>{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3">{product.category} / {product.subcategory}</td>
                      <td className="py-3">
                        <div>
                          {product.price.toFixed(2)} €
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              {product.originalPrice.toFixed(2)} €
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge variant={product.stock <= 5 ? "destructive" : "outline"}>
                          {product.stock} en stock
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Badge variant={product.status === "active" ? "default" : "secondary"}>
                          {product.status === "active" ? "Actif" : "Stock faible"}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditProduct(product.id)}
                          >
                            Modifier
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Commandes</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium">Commande</th>
                    <th className="pb-3 font-medium">Client</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Articles</th>
                    <th className="pb-3 font-medium">Montant</th>
                    <th className="pb-3 font-medium">Statut</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="py-3">{order.id}</td>
                      <td className="py-3">{order.customer}</td>
                      <td className="py-3">{order.date}</td>
                      <td className="py-3">{order.items}</td>
                      <td className="py-3">{order.total.toFixed(2)} €</td>
                      <td className="py-3">
                        <Badge variant={
                          order.status === "delivered" ? "default" :
                          order.status === "processing" ? "secondary" : "outline"
                        }>
                          {order.status === "delivered" ? "Livré" :
                          order.status === "processing" ? "En traitement" : "Expédié"}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Button variant="outline" size="sm">Détails</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Analyses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ventes mensuelles</CardTitle>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <p className="text-center text-gray-500">Graphique d'analyse des ventes mensuelles</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Produits populaires</CardTitle>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <p className="text-center text-gray-500">Graphique des produits les plus vendus</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-secondary/30 rounded-2xl p-8 md:p-12 mt-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Fonctionnalités du tableau de bord fournisseur</h2>
            <p className="text-lg text-gray-600 mb-8">
              Découvrez toutes les fonctionnalités disponibles pour optimiser la gestion de vos produits et améliorer vos ventes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              {proFeatures.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="bg-secondary/50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="text-accent" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
            <Button className="bg-accent hover:bg-accent/80 text-black font-medium py-3 px-8 rounded-full transition-colors shadow-sm">
              Explorer toutes les fonctionnalités
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pro;
