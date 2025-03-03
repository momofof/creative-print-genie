
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SupplierData } from "@/types/supplier";

// Check if user is registered as a supplier
export const checkSupplierStatus = async (userId: string): Promise<SupplierData | null> => {
  try {
    const { data: supplierData, error: supplierError } = await supabase
      .from("suppliers")
      .select("*")
      .eq("id", userId)
      .single();

    if (supplierError && supplierError.code !== "PGRST116") {
      throw new Error(supplierError.message);
    }

    return supplierData;
  } catch (error: any) {
    console.error("Error checking supplier status:", error);
    return null;
  }
};

// Fetch products for a supplier
export const fetchSupplierProducts = async (userId: string) => {
  try {
    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select("*")
      .eq("supplier_id", userId);

    if (productsError) {
      throw new Error("Erreur lors de la récupération des produits");
    }

    // Add stock property to products for now
    return productsData.map(product => ({
      ...product,
      stock: Math.floor(Math.random() * 100) // Mock stock value for now
    }));
  } catch (error: any) {
    console.error("Error fetching supplier products:", error);
    throw error;
  }
};

// Generate mock data for orders
export const fetchSupplierOrders = async () => {
  // Mock orders data (replace with real data when available)
  return [
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
  ];
};

// Generate mock stats
export const generateSupplierStats = (productsCount: number) => {
  return [
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
      value: productsCount.toString(),
      change: "+12.5%",
      changeType: "positive",
    },
    {
      title: "Taux de conversion",
      value: "3.2%",
      change: "-0.4%",
      changeType: "negative",
    }
  ];
};
