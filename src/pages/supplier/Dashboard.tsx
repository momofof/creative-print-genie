
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package, Settings, Users, ShoppingBag, BarChart3 } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatabaseProduct, ProductStatus } from "@/types/product";
import LoadingSpinner from "@/components/profile/LoadingSpinner";
import { toast } from "sonner";

export default function SupplierDashboard() {
  const [products, setProducts] = useState<DatabaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    publishedProducts: 0,
    draftProducts: 0,
    archivedProducts: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/login", { replace: true });
        toast.error("Vous devez être connecté pour accéder à cette page");
        return;
      }
      
      fetchProducts();
    };

    checkAuthentication();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedProducts = data.map(item => ({
        id: item.id,
        supplierId: item.supplier_id,
        name: item.name,
        description: item.description || "",
        price: Number(item.price),
        originalPrice: item.original_price ? Number(item.original_price) : undefined,
        image: item.image || "",
        category: item.category,
        subcategory: item.subcategory || "",
        isCustomizable: item.is_customizable,
        status: item.status as ProductStatus,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));

      setProducts(formattedProducts);
      
      // Calculate stats
      setStats({
        totalProducts: formattedProducts.length,
        publishedProducts: formattedProducts.filter(p => p.status === "published").length,
        draftProducts: formattedProducts.filter(p => p.status === "draft").length,
        archivedProducts: formattedProducts.filter(p => p.status === "archived").length,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Erreur lors du chargement des produits");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tableau de bord fournisseur</h1>
          <Button onClick={() => navigate("/supplier/product/new")}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter un produit
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total des produits</p>
                  <h3 className="text-2xl font-bold">{stats.totalProducts}</h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Produits publiés</p>
                  <h3 className="text-2xl font-bold">{stats.publishedProducts}</h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Brouillons</p>
                  <h3 className="text-2xl font-bold">{stats.draftProducts}</h3>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Settings className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Archivés</p>
                  <h3 className="text-2xl font-bold">{stats.archivedProducts}</h3>
                </div>
                <div className="bg-gray-100 p-3 rounded-full">
                  <BarChart3 className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="all">Tous les produits</TabsTrigger>
            <TabsTrigger value="published">Publiés</TabsTrigger>
            <TabsTrigger value="draft">Brouillons</TabsTrigger>
            <TabsTrigger value="archived">Archivés</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <ProductList 
              products={products} 
              loading={loading} 
              onRefresh={fetchProducts} 
            />
          </TabsContent>
          
          <TabsContent value="published" className="mt-0">
            <ProductList 
              products={products.filter(p => p.status === "published")} 
              loading={loading} 
              onRefresh={fetchProducts} 
            />
          </TabsContent>
          
          <TabsContent value="draft" className="mt-0">
            <ProductList 
              products={products.filter(p => p.status === "draft")} 
              loading={loading} 
              onRefresh={fetchProducts} 
            />
          </TabsContent>
          
          <TabsContent value="archived" className="mt-0">
            <ProductList 
              products={products.filter(p => p.status === "archived")} 
              loading={loading} 
              onRefresh={fetchProducts} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface ProductListProps {
  products: DatabaseProduct[];
  loading: boolean;
  onRefresh: () => Promise<void>;
}

function ProductList({ products, loading, onRefresh }: ProductListProps) {
  const navigate = useNavigate();
  
  const changeProductStatus = async (productId: string, newStatus: ProductStatus) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ status: newStatus })
        .eq("id", productId);
      
      if (error) throw error;
      
      toast.success(`Statut du produit mis à jour`);
      onRefresh();
    } catch (error) {
      console.error("Error updating product status:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><LoadingSpinner /></div>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Aucun produit trouvé</h3>
        <p className="mt-1 text-sm text-gray-500">
          Commencez par ajouter votre premier produit imprimable
        </p>
        <div className="mt-6">
          <Button onClick={() => navigate("/supplier/product/new")}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter un produit
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <div className="h-48 overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Package className="h-10 w-10 text-gray-400" />
              </div>
            )}
          </div>
          
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription className="line-clamp-1">
                  {product.description || "Aucune description"}
                </CardDescription>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                product.status === "published" ? "bg-green-100 text-green-800" :
                product.status === "draft" ? "bg-yellow-100 text-yellow-800" : 
                "bg-gray-100 text-gray-800"
              }`}>
                {product.status === "published" ? "Publié" :
                 product.status === "draft" ? "Brouillon" : "Archivé"}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pb-3">
            <div className="flex justify-between items-center mb-2">
              <div className="font-bold text-lg">{product.price.toFixed(2)} €</div>
              {product.originalPrice && (
                <div className="text-sm text-gray-500 line-through">{product.originalPrice.toFixed(2)} €</div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              <span className="bg-gray-100 px-2 py-1 rounded">{product.category}</span>
              {product.subcategory && (
                <span className="bg-gray-100 px-2 py-1 rounded">{product.subcategory}</span>
              )}
              {product.isCustomizable && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Personnalisable</span>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between pt-0">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(`/supplier/product/${product.id}/edit`)}
            >
              Modifier
            </Button>
            
            {product.status === "draft" && (
              <Button 
                size="sm" 
                onClick={() => changeProductStatus(product.id, "published")}
              >
                Publier
              </Button>
            )}
            
            {product.status === "published" && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => changeProductStatus(product.id, "archived")}
              >
                Archiver
              </Button>
            )}
            
            {product.status === "archived" && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => changeProductStatus(product.id, "published")}
              >
                Republier
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
