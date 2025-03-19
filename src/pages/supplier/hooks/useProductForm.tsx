import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { toJsonValue } from "@/utils/jsonUtils";

export interface ProductData {
  name: string;
  price: number;
  original_price: number | null;
  category: string;
  subcategory: string | null;
  description: string | null;
  image: string | null;
  status: 'draft' | 'published' | 'archived';
  is_customizable: boolean;
}

export interface ProductVariant {
  id?: string;
  size: string;
  color: string;
  hex_color: string;
  stock: number;
  price_adjustment: number | null;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  isNew?: boolean;
  isDeleted?: boolean;
}

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
    checkAuthentication();
    if (isEditing) {
      fetchProductData();
    } else {
      setIsLoading(false);
    }
  }, [productId]);

  const parseVariantsFromJson = (jsonVariants: any): ProductVariant[] => {
    if (!jsonVariants) return [];
    
    if (Array.isArray(jsonVariants)) {
      return jsonVariants as ProductVariant[];
    } else if (typeof jsonVariants === 'object') {
      return Object.values(jsonVariants) as ProductVariant[];
    }
    
    try {
      if (typeof jsonVariants === 'string') {
        const parsed = JSON.parse(jsonVariants);
        if (Array.isArray(parsed)) {
          return parsed;
        }
        return Object.values(parsed);
      }
    } catch (e) {
      console.error("Error parsing variants JSON:", e);
    }
    
    return [];
  };

  const checkAuthentication = async () => {
    const { data } = await supabase.auth.getSession();
    
    if (!data.session) {
      toast.error("Vous devez être connecté pour accéder à cette page");
      navigate("/login");
    }
  };

  const fetchProductData = async () => {
    try {
      if (!productId) return;
      
      // Fetch product data from the products_master table
      const { data: product, error: productError } = await supabase
        .from("products_master")
        .select("*")
        .eq("id", productId)
        .single();
      
      if (productError) throw productError;
      
      if (!product) {
        toast.error("Produit non trouvé");
        navigate("/supplier/dashboard");
        return;
      }
      
      // Extract the relevant fields for our ProductData type
      const typedProduct: ProductData = {
        name: product.name,
        price: product.price,
        original_price: product.original_price,
        category: product.category,
        subcategory: product.subcategory,
        description: product.description,
        image: product.image,
        status: product.status as 'draft' | 'published' | 'archived',
        is_customizable: product.is_customizable || false
      };
      
      setProductData(typedProduct);
      setImagePreview(product.image);
      
      // Parse variants from the JSONB field
      const parsedVariants = parseVariantsFromJson(product.variants);
      setVariants(parsedVariants);
      
      setIsLoading(false);
    } catch (error: any) {
      console.error("Error fetching product:", error);
      toast.error("Erreur lors du chargement du produit");
      navigate("/supplier/dashboard");
    }
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
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
      
      // If it's an existing variant from the database, mark it for deletion
      if (updated[index].id) {
        updated[index] = {
          ...updated[index],
          isDeleted: true
        };
        return updated;
      }
      
      // Otherwise just remove it from the array
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

  const uploadProductImage = async (): Promise<string | null> => {
    if (!imageFile) return productData.image;
    
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, imageFile);
      
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Erreur lors de l'upload de l'image");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        toast.error("Utilisateur non authentifié");
        navigate("/login");
        return;
      }
      
      // 1. Upload image if there's a new one
      const imageUrl = await uploadProductImage();
      
      // 2. Filter out deleted variants
      const activeVariants = variants.filter(variant => !variant.isDeleted);
      
      // 3. Create or update product in products_master table
      // Convert variants to Json compatible format
      const productPayload = {
        ...productData,
        supplier_id: userData.user.id,
        image: imageUrl || productData.image,
        variants: toJsonValue(activeVariants) // Convert to Json compatible format
      };
      
      if (isEditing && productId) {
        // Update existing product
        const { error: updateError } = await supabase
          .from("products_master")
          .update(productPayload)
          .eq("id", productId);
        
        if (updateError) throw updateError;
      } else {
        // Create new product
        const { error: createError } = await supabase
          .from("products_master")
          .insert(productPayload);
        
        if (createError) throw createError;
      }
      
      toast.success(isEditing ? "Produit mis à jour avec succès" : "Produit créé avec succès");
      navigate("/supplier/dashboard");
    } catch (error: any) {
      console.error("Error saving product:", error);
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
    addVariant,
    removeVariant,
    handleVariantChange,
    handleSubmit
  };
};
