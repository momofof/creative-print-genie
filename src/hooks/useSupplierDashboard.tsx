
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product, Order, Stat } from "@/types/dashboard";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface SupplierData {
  id: string;
  company_name: string;
  contact_name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  status: "active" | "pending" | "suspended";
}

// Define a type for the product without id, supplier_id, and stock
type CreateProductData = Omit<Product, 'id' | 'supplier_id' | 'stock'>;

export const useSupplierDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSupplier, setIsSupplier] = useState(false);
  const [supplierData, setSupplierData] = useState<SupplierData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stat[]>([]);
  const navigate = useNavigate();

  const loadSupplierData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if user is logged in
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error("Erreur lors de la récupération de la session");
      }
      
      if (!sessionData.session) {
        setIsSupplier(false);
        setIsLoading(false);
        toast.error("Vous devez être connecté pour accéder à cette page");
        navigate("/login");
        return;
      }

      const userId = sessionData.session.user.id;

      // Check if user is registered as a supplier
      const { data: supplierData, error: supplierError } = await supabase
        .from("suppliers")
        .select("*")
        .eq("id", userId)
        .single();

      if (supplierError && supplierError.code !== "PGRST116") {
        throw new Error(supplierError.message);
      }

      // If supplier exists, check if they are active
      if (supplierData) {
        if (supplierData.status !== "active") {
          setIsSupplier(false);
          setIsLoading(false);
          toast.error("Votre compte fournisseur est en attente d'approbation ou a été suspendu");
          navigate("/");
          return;
        }

        setIsSupplier(true);
        setSupplierData(supplierData);

        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .eq("supplier_id", userId);

        if (productsError) {
          throw new Error("Erreur lors de la récupération des produits");
        }

        // Add stock property to products for now
        const productsWithStock = productsData.map(product => ({
          ...product,
          stock: Math.floor(Math.random() * 100) // Mock stock value for now
        }));

        setProducts(productsWithStock);

        // Set mock stats data
        setStats([
          {
            title: "Ventes totales",
            value: "€8,421",
            change: "+16.2%",
            changeType: "positive",
          },
          {
            title: "Clients",
            value: "753",
            change: "+7.3%",
            changeType: "positive",
          },
          {
            title: "Produits actifs",
            value: productsWithStock.length.toString(),
            change: "+12.5%",
            changeType: "positive",
          },
          {
            title: "Taux de conversion",
            value: "3.2%",
            change: "-0.4%",
            changeType: "negative",
          }
        ]);

        // Mock orders data (replace with real data when available)
        setOrders([
          {
            id: "ORD-123456",
            customer: "Jean Dupont",
            date: "2023-05-12",
            total: 89.99,
            status: "Livré",
            items: 2,
          },
          {
            id: "ORD-123457",
            customer: "Marie Martin",
            date: "2023-05-10",
            total: 129.99,
            status: "En cours",
            items: 3,
          },
          {
            id: "ORD-123458",
            customer: "Pierre Durand",
            date: "2023-05-08",
            total: 59.99,
            status: "En attente",
            items: 1,
          },
        ]);
      } else {
        setIsSupplier(false);
        toast.error("Vous n'êtes pas enregistré comme fournisseur");
        navigate("/supplier/register");
      }
    } catch (error: any) {
      console.error("Error loading supplier data:", error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSupplierData();
  }, []);

  // Add deleteProduct function
  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);
      
      if (error) throw error;
      
      // Update products list after successful deletion
      setProducts(products.filter(product => product.id !== productId));
      toast.success("Produit supprimé avec succès.");
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast.error(`Erreur lors de la suppression: ${error.message}`);
    }
  };

  // Create a new product
  const createProduct = async (productData: CreateProductData) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("Vous devez être connecté pour créer un produit");
        return null;
      }

      const userId = sessionData.session.user.id;
      
      const { data, error } = await supabase
        .from('products')
        .insert({
          ...productData,
          supplier_id: userId
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success("Produit créé avec succès!");
      // Add the new product to the products state with a mock stock value
      const newProductWithStock = {
        ...data,
        stock: 0 // New product starts with 0 stock
      };
      
      setProducts([...products, newProductWithStock]);
      return data.id;
    } catch (error: any) {
      console.error("Error creating product:", error);
      toast.error(`Erreur lors de la création du produit: ${error.message}`);
      return null;
    }
  };

  return {
    isLoading,
    isSupplier,
    supplierData,
    products,
    orders,
    stats,
    error,
    deleteProduct,
    createProduct,
    refreshData: loadSupplierData
  };
};
