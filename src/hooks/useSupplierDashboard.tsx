
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product, Order, Stat } from "@/types/dashboard";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { SupplierData, CreateProductData } from "@/types/supplier";
import { 
  checkSupplierStatus, 
  fetchSupplierProducts, 
  fetchSupplierOrders, 
  generateSupplierStats 
} from "@/services/supplierService";
import { deleteProduct as deleteProductService, createProduct as createProductService } from "@/services/productService";

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
      const supplierData = await checkSupplierStatus(userId);

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
        const productsWithStock = await fetchSupplierProducts(userId);
        setProducts(productsWithStock);

        // Set mock stats data
        setStats(generateSupplierStats(productsWithStock.length));

        // Mock orders data
        setOrders(await fetchSupplierOrders());
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

  // Delete product wrapper function
  const deleteProduct = async (productId: string) => {
    const success = await deleteProductService(productId);
    if (success) {
      // Update products list after successful deletion
      setProducts(products.filter(product => product.id !== productId));
    }
  };

  // Create product wrapper function
  const createProduct = async (productData: CreateProductData) => {
    const productId = await createProductService(productData);
    if (productId) {
      // Add the new product to the products state with a mock stock value
      const newProductWithStock = {
        ...productData,
        id: productId,
        stock: 0, // New product starts with 0 stock
        supplier_id: supplierData?.id || ""
      };
      
      setProducts([...products, newProductWithStock as Product]);
    }
    return productId;
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
