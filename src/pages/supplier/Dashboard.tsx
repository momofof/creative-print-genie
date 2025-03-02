
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatabaseProduct, ProductStatus } from "@/types/product";
import { toast } from "sonner";
import ProductStats from "@/components/supplier/ProductStats";
import ProductsGrid from "@/components/supplier/ProductsGrid";

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

  const changeProductStatus = async (productId: string, newStatus: ProductStatus) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ status: newStatus })
        .eq("id", productId);
      
      if (error) throw error;
      
      toast.success(`Statut du produit mis à jour`);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product status:", error);
      toast.error("Erreur lors de la mise à jour du statut");
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

        <ProductStats 
          totalProducts={stats.totalProducts}
          publishedProducts={stats.publishedProducts}
          draftProducts={stats.draftProducts}
          archivedProducts={stats.archivedProducts}
        />

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="all">Tous les produits</TabsTrigger>
            <TabsTrigger value="published">Publiés</TabsTrigger>
            <TabsTrigger value="draft">Brouillons</TabsTrigger>
            <TabsTrigger value="archived">Archivés</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <ProductsGrid 
              products={products} 
              loading={loading} 
              onRefresh={fetchProducts} 
              onStatusChange={changeProductStatus}
            />
          </TabsContent>
          
          <TabsContent value="published" className="mt-0">
            <ProductsGrid 
              products={products.filter(p => p.status === "published")} 
              loading={loading} 
              onRefresh={fetchProducts} 
              onStatusChange={changeProductStatus}
            />
          </TabsContent>
          
          <TabsContent value="draft" className="mt-0">
            <ProductsGrid 
              products={products.filter(p => p.status === "draft")} 
              loading={loading} 
              onRefresh={fetchProducts} 
              onStatusChange={changeProductStatus}
            />
          </TabsContent>
          
          <TabsContent value="archived" className="mt-0">
            <ProductsGrid 
              products={products.filter(p => p.status === "archived")} 
              loading={loading} 
              onRefresh={fetchProducts} 
              onStatusChange={changeProductStatus}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
