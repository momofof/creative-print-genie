import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { toJsonValue } from "@/utils/jsonUtils";
import { Json } from "@/integrations/supabase/types";

export interface ProductData {
  name: string;
  price: number;
  original_price: number | null;
  category: string;
  subcategory: string | null;
  description: string | null;
  image: string | null;
  variant_images: Record<string, string> | null;
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
  image?: string | null;
  isNew?: boolean;
  isDeleted?: boolean;
}

// Define a type for the product data returned from Supabase
interface SupabaseProduct {
  category: string;
  created_at: string | null;
  customizations: Json | null;
  description: string | null;
  id: string;
  image: string | null;
  is_customizable: boolean | null;
  name: string;
  original_price: number | null;
  price: number;
  status: string;
  stock: number | null;
  subcategory: string | null;
  supplier_id: string | null;
  updated_at: string | null;
  variants: Json | null;
  variant_images?: Json | null;  // Added this property to match the database schema
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
    variant_images: null,
    status: "draft",
    is_customizable: false
  });
  
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [variantImageFiles, setVariantImageFiles] = useState<Record<string, File>>({});
  const [variantImagePreviews, setVariantImagePreviews] = useState<Record<string, string>>({});

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
      
      // Safely typecast the product to our SupabaseProduct type
      const typedProduct = product as SupabaseProduct;
      
      // Extract the relevant fields for our ProductData type
      const formattedProduct: ProductData = {
        name: typedProduct.name,
        price: typedProduct.price,
        original_price: typedProduct.original_price,
        category: typedProduct.category,
        subcategory: typedProduct.subcategory,
        description: typedProduct.description,
        image: typedProduct.image,
        variant_images: typedProduct.variant_images ? typedProduct.variant_images as Record<string, string> : null,
        status: typedProduct.status as 'draft' | 'published' | 'archived',
        is_customizable: typedProduct.is_customizable || false
      };
      
      setProductData(formattedProduct);
      setImagePreview(typedProduct.image);
      
      // Parse variants from the JSONB field
      const parsedVariants = parseVariantsFromJson(typedProduct.variants);
      setVariants(parsedVariants);
      
      // Set up variant image previews if they exist
      if (typedProduct.variant_images) {
        setVariantImagePreviews(typedProduct.variant_images as Record<string, string>);
      }
      
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

  const handleVariantImageChange = (variantId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Store the file
      setVariantImageFiles(prev => ({
        ...prev,
        [variantId]: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setVariantImagePreviews(prev => ({
          ...prev,
          [variantId]: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addVariant = () => {
    const newVariantId = crypto.randomUUID();
    setVariants(prev => [
      ...prev,
      {
        id: newVariantId,
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
      const variantId = updated[index].id;
      
      // Remove variant image if it exists
      if (variantId) {
        setVariantImageFiles(prev => {
          const newFiles = { ...prev };
          delete newFiles[variantId];
          return newFiles;
        });
        
        setVariantImagePreviews(prev => {
          const newPreviews = { ...prev };
          delete newPreviews[variantId];
          return newPreviews;
        });
      }
      
      // If it's an existing variant from the database, mark it for deletion
      if (updated[index].id && !updated[index].isNew) {
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
        .from('product-images')
        .upload(filePath, imageFile);
      
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Erreur lors de l'upload de l'image");
      return null;
    }
  };

  const uploadVariantImages = async (): Promise<Record<string, string>> => {
    const variantImages: Record<string, string> = { ...variantImagePreviews };
    
    // Filter out variant image previews for deleted variants
    const deletedVariantIds = variants
      .filter(v => v.isDeleted)
      .map(v => v.id)
      .filter((id): id is string => id !== undefined);
    
    deletedVariantIds.forEach(id => {
      delete variantImages[id];
    });
    
    // Upload new variant images
    for (const [variantId, file] of Object.entries(variantImageFiles)) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `variant-${variantId}-${crypto.randomUUID()}.${fileExt}`;
        const filePath = `product-images/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
        
        variantImages[variantId] = urlData.publicUrl;
      } catch (error) {
        console.error(`Error uploading variant image for ${variantId}:`, error);
        toast.error(`Erreur lors de l'upload de l'image pour une variante`);
      }
    }
    
    return variantImages;
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
      
      // 1. Upload main product image if there's a new one
      const imageUrl = await uploadProductImage();
      
      // 2. Upload variant images
      const variantImagesUrls = await uploadVariantImages();
      
      // 3. Filter out deleted variants and update variant images
      const activeVariants = variants
        .filter(variant => !variant.isDeleted)
        .map(variant => ({
          ...variant,
          image: variant.id && variantImagesUrls[variant.id] ? variantImagesUrls[variant.id] : null
        }));
      
      // 4. Create or update product in products_master table
      const productPayload = {
        ...productData,
        supplier_id: userData.user.id,
        image: imageUrl || productData.image,
        variant_images: toJsonValue(variantImagesUrls), // Store variant images mapping
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
        // Get the highest current product ID to generate the next sequential ID
        const { data: lastProduct, error: countError } = await supabase
          .from('products_master')
          .select('id')
          .order('id', { ascending: false })
          .limit(1);
        
        let nextId = 1;
        if (!countError && lastProduct && lastProduct.length > 0) {
          const highestId = parseInt(lastProduct[0].id);
          if (!isNaN(highestId)) {
            nextId = highestId + 1;
          }
        }
        
        // Create new product with sequential ID
        const { error: createError } = await supabase
          .from("products_master")
          .insert({
            ...productPayload,
            id: nextId.toString()
          });
        
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
    variantImageFiles,
    variantImagePreviews,
    setImageFile,
    setImagePreview,
    handleInputChange,
    handleSelectChange,
    handleCheckboxChange,
    handleImageChange,
    handleVariantImageChange,
    addVariant,
    removeVariant,
    handleVariantChange,
    handleSubmit,
    setVariants // Exposer cette fonction pour le SimpleVariantEditor
  };
};
