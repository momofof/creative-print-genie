
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProductData, ProductVariant } from "./types/productTypes";
import { useAuthCheck } from "./useAuthCheck";
import { useProductFetch } from "./useProductFetch";
import { useImageUpload } from "./useImageUpload";
import { useProductSubmit } from "./useProductSubmit";

export type { ProductVariant };

export const useProductForm = (productId?: string) => {
  const navigate = useNavigate();
  const { checkAuthentication } = useAuthCheck();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [variantImageFiles, setVariantImageFiles] = useState<Record<string, File>>({});
  const [variantImagePreviews, setVariantImagePreviews] = useState<Record<string, string>>({});
  
  const [productData, setProductData] = useState<ProductData>({
    name: "",
    description: "",
    price: 0,
    original_price: 0,
    category: "",
    subcategory: "",
    image: "",
    status: "draft",
    is_customizable: false
  });
  
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  
  const { fetchProductData } = useProductFetch(
    setProductData,
    setImagePreview,
    setVariants,
    setVariantImagePreviews,
    setIsLoading
  );
  
  const { uploadProductImage, uploadVariantImages } = useImageUpload(
    imageFile,
    productData, 
    variantImageFiles,
    variantImagePreviews,
    variants
  );
  
  const { submitProductData } = useProductSubmit(
    productId,
    productData,
    variants,
    uploadProductImage,
    uploadVariantImages,
    setIsSaving,
    navigate
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

  const handleCheckboxChange = (name: string, checked: boolean) => {
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

  const handleVariantImageChange = (variantId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVariantImageFiles(prev => ({ ...prev, [variantId]: file }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          setVariantImagePreviews(prev => ({ 
            ...prev, 
            [variantId]: e.target!.result as string 
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: crypto.randomUUID(),
      size: "M",
      color: "",
      hex_color: "#000000",
      stock: 0,
      price_adjustment: 0,
      status: "in_stock",
      isNew: true
    };
    
    setVariants(prev => [...prev, newVariant]);
  };

  const removeVariant = (index: number) => {
    setVariants(prev => {
      const updated = [...prev];
      
      if (updated[index].id && !updated[index].isNew) {
        // Mark for deletion if it's an existing variant
        updated[index] = { ...updated[index], isDeleted: true };
        return updated;
      } else {
        // Remove completely if it's a new variant
        updated.splice(index, 1);
        return updated;
      }
    });
  };

  const handleVariantChange = (index: number, field: keyof ProductVariant, value: string | number) => {
    setVariants(prev => {
      const updated = [...prev];
      updated[index] = { 
        ...updated[index], 
        [field]: value 
      };
      return updated;
    });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!productData.name || !productData.category) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    await submitProductData();
  };

  return {
    isLoading,
    isSaving,
    productData,
    variants,
    imagePreview,
    variantImagePreviews,
    handleInputChange,
    handleSelectChange,
    handleCheckboxChange,
    handleImageChange,
    handleVariantImageChange,
    addVariant,
    removeVariant,
    handleVariantChange,
    handleSubmit,
    setVariants
  };
};
