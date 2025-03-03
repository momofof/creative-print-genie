
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product, Order } from "@/types/dashboard";

interface SupplierData {
  id: string;
  company_name: string;
  contact_name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  status: "active" | "pending" | "suspended";
}

export const useSupplierDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSupplier, setIsSupplier] = useState(false);
  const [supplierData, setSupplierData] = useState<SupplierData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

        // If supplier exists, fetch products and mock orders
        if (supplierData) {
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

          setProducts(productsData);

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
        }
      } catch (error: any) {
        console.error("Error loading supplier data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadSupplierData();
  }, []);

  return {
    isLoading,
    isSupplier,
    supplierData,
    products,
    orders,
    error,
  };
};
