
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Package, 
  PlusCircle, 
  Store, 
  ShoppingBag, 
  Settings, 
  Users, 
  LogOut,
  Layers,
  Truck 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
      <div className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Store className="mr-2 h-6 w-6" />
            Espace Fournisseur
          </h2>
        </div>
        
        <nav className="space-y-1">
          <Link to="/supplier/dashboard" className="flex items-center px-3 py-2 text-sm font-medium text-teal-700 bg-teal-50 rounded-md">
            <Layers className="mr-3 h-5 w-5" />
            Tableau de bord
          </Link>
          <Link to="/supplier/product/new" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
            <PlusCircle className="mr-3 h-5 w-5" />
            Ajouter un produit
          </Link>
          <Link to="/supplier/products" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
            <Package className="mr-3 h-5 w-5" />
            Mes produits
          </Link>
          <Link to="/supplier/orders" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
            <ShoppingBag className="mr-3 h-5 w-5" />
            Commandes
          </Link>
          <Link to="/supplier/customers" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
            <Users className="mr-3 h-5 w-5" />
            Clients
          </Link>
          <Link to="/supplier/settings" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
            <Settings className="mr-3 h-5 w-5" />
            Paramètres
          </Link>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Déconnexion
          </button>
        </nav>
      </div>
      
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            <Store className="mr-2 h-5 w-5" />
            Espace Fournisseur
          </h2>
          <button className="text-gray-500">
            <span className="sr-only">Open menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-8 md:p-10 pt-20 md:pt-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600">Bienvenue dans votre espace fournisseur</p>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-full mr-4">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total produits</p>
                  <h3 className="text-2xl font-bold">{stats.totalProducts}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-full mr-4">
                  <Layers className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">En stock</p>
                  <h3 className="text-2xl font-bold">{stats.productsInStock}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-full mr-4">
                  <ShoppingBag className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Stock faible</p>
                  <h3 className="text-2xl font-bold">{stats.lowStockProducts}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-full mr-4">
                  <Truck className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Rupture de stock</p>
                  <h3 className="text-2xl font-bold">{stats.outOfStockProducts}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent products */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Produits récents</CardTitle>
              <Link to="/supplier/products">
                <Button variant="ghost" size="sm">
                  Voir tous
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {products.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-3 font-medium text-gray-500">Nom</th>
                      <th className="pb-3 font-medium text-gray-500">Catégorie</th>
                      <th className="pb-3 font-medium text-gray-500">Prix</th>
                      <th className="pb-3 font-medium text-gray-500">Statut</th>
                      <th className="pb-3 font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="py-3">{product.name}</td>
                        <td className="py-3">{product.category}</td>
                        <td className="py-3">{product.price} €</td>
                        <td className="py-3">
                          <span 
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              product.status === 'published' 
                                ? 'bg-green-100 text-green-800'
                                : product.status === 'draft'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {product.status === 'published' 
                              ? 'Publié' 
                              : product.status === 'draft'
                              ? 'Brouillon'
                              : 'Archivé'
                            }
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex space-x-2">
                            <Link to={`/supplier/product/${product.id}/edit`}>
                              <Button variant="outline" size="sm">
                                Modifier
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">Vous n'avez pas encore de produits</p>
                <Link to="/supplier/product/new">
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter un produit
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>Les actions les plus courantes pour gérer votre boutique</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="/supplier/product/new">
                <Button variant="outline" className="w-full justify-start">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Ajouter un produit
                </Button>
              </Link>
              <Link to="/supplier/orders">
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Voir les commandes
                </Button>
              </Link>
              <Link to="/supplier/settings">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Paramètres
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupplierDashboard;
