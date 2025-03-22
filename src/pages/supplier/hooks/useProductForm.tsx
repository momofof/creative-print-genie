
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ProductData } from "./types/productTypes";
import { useAuthCheck } from "./useAuthCheck";
import { useProductFetch } from "./useProductFetch";
import { useProductSubmit } from "./useProductSubmit";

export interface ProductVariant {
  id: string;
  product_id?: string;
  size: string;
  color: string;
  hex_color: string;
  stock: number;
  price_adjustment?: number;
  status: "in_stock" | "low_stock" | "out_of_stock";
  bat?: string;
  poids?: string;
  format?: string;
  quantite?: string;
  echantillon?: string;
  types_impression?: string;
  type_de_materiaux?: string;
  details_impression?: string;
  orientation_impression?: string;
  isNew?: boolean;
  isDeleted?: boolean;
}

export const useProductForm = (productId?: string) => {
  const navigate = useNavigate();
  const { checkAuthentication } = useAuthCheck();
  
  const [isLoading, setIsLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [productData, setProductData] = useState<ProductData>({
    name: "",
    description: null, // Explicitly setting description to null initially
    price: 0,
    original_price: 0,
    category: "",
    subcategory: "", // Now required
    image: null,
    status: "draft",
    is_customizable: false,
    // Champs de variantes initialisés
    size: "",
    color: "",
    hex_color: "#000000",
    stock: 0,
    price_adjustment: 0,
    variant_status: "in_stock",
    bat: "",
    poids: "",
    format: "",
    quantite: "",
    echantillon: "",
    types_impression: "",
    type_de_materiaux: "",
    details_impression: "",
    orientation_impression: ""
  });
  
  const { fetchProductData } = useProductFetch(
    setProductData,
    setImagePreview,
    setIsLoading
  );
  
  const { isSaving, handleSubmit: submitProductData } = useProductSubmit(
    !!productId,
    productId,
    productData,
    imageFile
  );

  useEffect(() => {
    const init = async () => {
      const isAuthenticated = await checkAuthentication();
      if (!isAuthenticated) return;
      
      if (productId) {
        await fetchProductData(productId);
      } else {
        setIsLoading(false);
      }
    };
    
    init();
  }, [productId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setProductData(prev => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          setImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!productData.name || !productData.category || !productData.subcategory) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    await submitProductData(e);
  };

  return {
    isLoading,
    isSaving,
    productData,
    imagePreview,
    handleInputChange,
    handleSelectChange,
    handleCheckboxChange,
    handleImageChange,
    handleSubmit
  };
};
