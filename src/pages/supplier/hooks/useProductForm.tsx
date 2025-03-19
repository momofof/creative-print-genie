import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ProductData, ProductVariant } from "./product-form/types";
import { checkAuthentication } from "./product-form/authUtils";
import { fetchProductData } from "./product-form/productDataFetcher";
import { saveProduct } from "./product-form/productSaver";
import { addVariant, removeVariant, updateVariant } from "./product-form/variantUtils";

export type { ProductData, ProductVariant } from "./product-form/types";

export const useProductForm = (productId?: string) => {
  const navigate = useNavigate();
  const isEditing = !!productId;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [productData, setProductData] = useState<ProductData>({
    name: "",
    price: 0,
    original_price: null,
    category: "",
    subcategory: null,
    description: null,
    image: null,
    status: "draft",
    is_customizable: false
  });
  
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const initializeForm = async () => {
      const isAuthenticated = await checkAuthentication();
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }
      
      if (isEditing && productId) {
        try {
          const { productData, variants, imageUrl } = await fetchProductData(productId);
          setProductData(productData);
          setVariants(variants);
          setImagePreview(imageUrl);
        } catch (error) {
          navigate("/supplier/dashboard");
        }
      }
      
      setIsLoading(false);
    };
    
    initializeForm();
  }, [productId, navigate, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setProductData(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setProductData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVariantChange = (index: number, field: keyof ProductVariant, value: string | number | string[]) => {
    setVariants(prev => updateVariant(prev, index, field, value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await saveProduct(productData, variants, imageFile, isEditing, productId);
      
      toast.success(isEditing ? "Produit mis à jour avec succès" : "Produit créé avec succès");
      navigate("/supplier/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'enregistrement du produit");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isLoading,
    isSaving,
    productData,
    variants,
    imageFile,
    imagePreview,
    setImageFile,
    setImagePreview,
    handleInputChange,
    handleSelectChange,
    handleCheckboxChange,
    handleImageChange,
    addVariant: () => setVariants(prev => addVariant(prev)),
    removeVariant: (index: number) => setVariants(prev => removeVariant(prev, index)),
    handleVariantChange,
    handleSubmit
  };
};
