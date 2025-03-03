
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useSupplierDashboard } from "@/hooks/useSupplierDashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import LoadingSpinner from "@/components/profile/LoadingSpinner";

// Define a type for the product status to ensure we use the correct enum values
type ProductStatus = "draft" | "published" | "archived";

const ProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoading: dashboardLoading, isSupplier } = useSupplierDashboard();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    subcategory: "",
    image: "",
    status: "draft" as ProductStatus, // Ensure correct type
  });

  // Load product data if editing
  useEffect(() => {
    const loadProduct = async () => {
      if (!id || id === "new") {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          navigate("/login");
          return;
        }

        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .eq("supplier_id", sessionData.session.user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setProduct({
            name: data.name,
            description: data.description || "",
            price: data.price,
            category: data.category,
            subcategory: data.subcategory || "",
            image: data.image || "",
            status: data.status || "draft",
          });
        }
      } catch (error: any) {
        toast.error(`Erreur: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (!dashboardLoading) {
      loadProduct();
    }
  }, [id, dashboardLoading, navigate]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("Vous devez être connecté pour enregistrer un produit");
        return;
      }

      const userId = sessionData.session.user.id;
      
      if (id && id !== "new") {
        // Update existing product
        const { error } = await supabase
          .from("products")
          .update({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            subcategory: product.subcategory || null,
            image: product.image || null,
            status: product.status,
            updated_at: new Date().toISOString(), // Convert Date to string
          })
          .eq("id", id)
          .eq("supplier_id", userId);

        if (error) throw error;
        toast.success("Produit mis à jour avec succès!");
      } else {
        // Create new product
        const { data, error } = await supabase
          .from("products")
          .insert({
            name: product.name,
            description: product.description || null,
            price: product.price,
            category: product.category,
            subcategory: product.subcategory || null,
            image: product.image || null,
            supplier_id: userId,
            status: product.status,
          })
          .select();

        if (error) throw error;
        toast.success("Produit créé avec succès!");
        navigate(`/supplier/product/${data[0].id}/edit`);
      }
      
      // Navigate back to dashboard after successful save
      navigate("/supplier/dashboard");
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value
    }));
  };

  if (dashboardLoading || loading) {
    return <LoadingSpinner />;
  }

  if (!isSupplier) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
          <h1 className="text-3xl font-bold mb-4">Accès non autorisé</h1>
          <p className="mb-6">Vous devez être enregistré comme fournisseur pour accéder à cette page.</p>
          <Button onClick={() => navigate("/supplier/register")}>S'inscrire comme fournisseur</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-8">
          {id && id !== "new" ? "Modifier le produit" : "Nouveau produit"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du produit</Label>
              <Input
                id="name"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
                placeholder="Nom du produit"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={product.description}
                onChange={handleChange}
                placeholder="Description du produit"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={product.price}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <select
                  id="status"
                  name="status"
                  value={product.status}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                  <option value="archived">Archivé</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Input
                  id="category"
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  required
                  placeholder="Catégorie"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subcategory">Sous-catégorie (optionnel)</Label>
                <Input
                  id="subcategory"
                  name="subcategory"
                  value={product.subcategory}
                  onChange={handleChange}
                  placeholder="Sous-catégorie"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL de l'image</Label>
              <Input
                id="image"
                name="image"
                value={product.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
              {product.image && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Aperçu:</p>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-40 object-contain border rounded"
                    onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/supplier/dashboard")}
              disabled={submitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Enregistrement..." : "Enregistrer le produit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
