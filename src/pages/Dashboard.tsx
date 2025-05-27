
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Plus, Clock, CheckCircle, AlertTriangle, CreditCard, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-32 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="h-16 w-16 text-blue-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Accès restreint</h1>
            <p className="text-gray-600 mb-8">Vous devez être connecté pour accéder à votre tableau de bord.</p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/auth">Se connecter</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tableau de Bord SafePay XOF
            </h1>
            <p className="text-gray-600">
              Gérez vos dépôts sécurisés et transactions en toute simplicité
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Dépôts en cours</p>
                    <p className="text-2xl font-bold text-blue-600">0</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Fonds en attente</p>
                    <p className="text-2xl font-bold text-yellow-600">0 XOF</p>
                  </div>
                  <Shield className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Transactions réussies</p>
                    <p className="text-2xl font-bold text-green-600">0</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total sécurisé</p>
                    <p className="text-2xl font-bold text-purple-600">0 XOF</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="buyer" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="buyer">Acheteur</TabsTrigger>
              <TabsTrigger value="seller">Vendeur</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>

            {/* Buyer Tab */}
            <TabsContent value="buyer" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Nouveau Dépôt Sécurisé
                    </CardTitle>
                    <CardDescription>
                      Effectuez un dépôt sécurisé pour votre achat
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                      <Link to="/new-deposit">
                        Créer un nouveau dépôt
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Dépôts en cours</CardTitle>
                    <CardDescription>
                      Vos dépôts en attente de livraison
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>Aucun dépôt en cours</p>
                      <p className="text-sm">Vos dépôts actifs apparaîtront ici</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Seller Tab */}
            <TabsContent value="seller" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Fonds en Attente
                    </CardTitle>
                    <CardDescription>
                      Montant total de vos ventes en attente
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6">
                      <p className="text-3xl font-bold text-blue-600">0 XOF</p>
                      <p className="text-sm text-gray-500 mt-2">En attente de confirmation</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>
                      Nouveaux dépôts et confirmations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>Aucune notification</p>
                      <p className="text-sm">Les nouveaux dépôts apparaîtront ici</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Historique des Transactions</CardTitle>
                  <CardDescription>
                    Toutes vos transactions SafePay XOF
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <Shield className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium">Aucune transaction</p>
                    <p className="text-sm">Vos transactions sécurisées apparaîtront ici</p>
                    <Button asChild className="mt-4 bg-blue-600 hover:bg-blue-700">
                      <Link to="/new-deposit">
                        Effectuer votre premier dépôt
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
