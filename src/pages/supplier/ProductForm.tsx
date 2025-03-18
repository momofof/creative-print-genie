
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ProductData, ProductVariant } from "@/types/supplier";
import { 
  saveProduct, 
  fetchProductData, 
  processCsvImport 
} from "@/utils/productFormUtils";
import ProductFormHeader from "@/components/supplier/ProductFormHeader";
import ProductInfoSection from "@/components/supplier/ProductInfoSection";
import ProductVariantsSection from "@/components/supplier/ProductVariantsSection";
import ProductImageSection from "@/components/supplier/ProductImageSection";

const ProductForm = () => {
  const { productId } = useParams<{productId?: string}>();
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
    is_customizable: false,
    stock: 0
  });
  
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [supplierId, setSupplierId] = useState<string | null>(null);

  useEffect(() => {
    checkAuthentication();
    if (isEditing && productId) {
      fetchProductData(productId, setProductData, setVariants, setImagePreview)
        .then(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [productId]);

  const checkAuthentication = async () => {
    const { data } = await supabase.auth.getSession();
    
    if (!data.session) {
      toast.error("Vous devez être connecté pour accéder à cette page");
      navigate("/login");
      return;
    }
    
    setSupplierId(data.session.user.id);
  };

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

  const handleImageChange = (file: File) => {
    setImageFile(file);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const addVariant = () => {
    setVariants(prev => [
      ...prev,
      {
        size: "M",
        color: "Noir",
        hex_color: "#000000",
        stock: 0,
        price_adjustment: 0,
        status: "in_stock",
        isNew: true
      }
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants(prev => {
      const updated = [...prev];
      
      if (updated[index].id) {
        updated[index] = {
          ...updated[index],
          isDeleted: true
        };
        return updated;
      }
      
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleVariantChange = (index: number, field: keyof ProductVariant, value: string | number) => {
    setVariants(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: field === "stock" || field === "price_adjustment" 
          ? parseFloat(value as string) || 0 
          : value
      };
      return updated;
    });
  };

  const handleImport = async (file: File, type: "products" | "variants") => {
    try {
      await processCsvImport(file, type, productId, supplierId);
      if (type === "variants" && productId) {
        // Refresh product data after importing variants
        await fetchProductData(productId, setProductData, setVariants, setImagePreview);
      } else if (type === "products") {
        navigate("/supplier/dashboard");
      }
    } catch (error) {
      console.error("Import error:", error);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    setIsSaving(true);
    
    try {
      const savedProductId = await saveProduct(
        productData,
        variants,
        imageFile,
        supplierId,
        isEditing,
        productId
      );
      
      if (savedProductId) {
        navigate("/supplier/dashboard");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <ProductFormHeader 
        isEditing={isEditing}
        isSaving={isSaving}
        productId={productId}
        onImport={handleImport}
        onSubmit={handleSubmit}
      />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <ProductInfoSection 
                productData={productData}
                onInputChange={handleInputChange}
                onSelectChange={handleSelectChange}
                onCheckboxChange={handleCheckboxChange}
              />
              
              <ProductVariantsSection 
                variants={variants}
                onVariantChange={handleVariantChange}
                onAddVariant={addVariant}
                onRemoveVariant={removeVariant}
              />
            </div>
            
            <div className="lg:col-span-1">
              <ProductImageSection
                imagePreview={imagePreview}
                onImageChange={handleImageChange}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
