
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PackageOpen, Palette } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import LoadingSpinner from "@/components/profile/LoadingSpinner";
import ProductFormModal from "@/components/supplier/ProductFormModal";
import CustomizationManager from "@/components/supplier/CustomizationManager";
import { Product } from "@/types/dashboard";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    } else {
      setIsLoading(false);
    }
  }, [productId]);

  const fetchProduct = async (id: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Impossible de récupérer les données du produit");
      navigate("/pro");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/pro");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaved = () => {
    fetchProduct(productId!);
    setIsEditing(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!product && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Produit non trouvé</h2>
            <p className="mt-2 text-gray-600">Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
            <Button onClick={handleBack} className="mt-6">
              Retour au tableau de bord
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={handleBack} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold">{product?.name}</h1>
            <span className={`text-xs px-2 py-1 rounded-full ${
              product?.status === "published" ? "bg-green-100 text-green-800" :
              product?.status === "draft" ? "bg-yellow-100 text-yellow-800" :
              "bg-gray-100 text-gray-800"
            }`}>
              {product?.status === "published" ? "Publié" :
               product?.status === "draft" ? "Brouillon" : "Archivé"}
            </span>
          </div>
          
          <Button onClick={handleEdit}>
            Modifier le produit
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-1">
            {product?.image ? (
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full rounded-lg shadow-md object-cover aspect-square"
              />
            ) : (
              <div className="w-full rounded-lg bg-gray-100 flex items-center justify-center aspect-square">
                <PackageOpen className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Catégorie</h3>
                <p className="mt-1">{product?.category} {product?.subcategory ? `/ ${product.subcategory}` : ''}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Prix</h3>
                <p className="mt-1">
                  {product?.price.toFixed(2)} €
                  {product?.original_price && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      {product.original_price.toFixed(2)} €
                    </span>
                  )}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Stock</h3>
                <p className="mt-1">{product?.stock} unités</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Personnalisable</h3>
                <p className="mt-1">{product?.is_customizable ? "Oui" : "Non"}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1 text-gray-700">{product?.description || "Aucune description"}</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Détails du produit</TabsTrigger>
            <TabsTrigger value="customization" disabled={!product?.is_customizable}>
              Personnalisation
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="py-4">
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Informations supplémentaires</h3>
              <p className="text-gray-600">
                Ajoutez des informations supplémentaires sur votre produit comme les dimensions, 
                les matériaux, les instructions d'entretien, etc.
              </p>
              <div className="flex justify-center py-8">
                <Button onClick={handleEdit}>
                  Modifier les détails du produit
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="customization" className="py-4">
            {product?.is_customizable ? (
              <CustomizationManager productId={product.id} />
            ) : (
              <div className="text-center py-12">
                <Palette className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Ce produit n'est pas personnalisable
                </h3>
                <p className="mt-2 text-gray-500">
                  Pour ajouter des options de personnalisation, vous devez d'abord marquer ce produit comme personnalisable.
                </p>
                <Button onClick={handleEdit} className="mt-6">
                  Activer la personnalisation
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Product Modal */}
      <ProductFormModal 
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        productId={productId}
        onProductSaved={handleSaved}
      />
    </div>
  );
};

export default ProductDetail;
