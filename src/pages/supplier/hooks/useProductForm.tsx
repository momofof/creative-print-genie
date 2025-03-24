
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

// Define ProductData type for the form
interface ProductData {
  id?: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  category: string;
  subcategory: string | null;
  image: string | null;
  status: "draft" | "published" | "archived";
  is_customizable: boolean;
  supplier_id?: string | null;
  
  // Variant fields
  size: string | null;
  color: string | null;
  hex_color: string | null;
  bat: string | null;
  poids: string | null;
  format: string | null;
  quantite: string | null;
  echantillon: string | null;
  types_impression: string | null;
  type_de_materiaux: string | null;
  details_impression: string | null;
  orientation_impression: string | null;
  
  // Added missing fields
  stock: number | null;
  price_adjustment: number | null;
  variant_status: string | null;
  variant_image_url: string | null;
}

export const useProductForm = (productId?: string) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // State for the form data
  const [productData, setProductData] = useState<ProductData>({
    name: "",
    description: null,
    price: 0,
    original_price: null,
    category: "",
    subcategory: null,
    image: null,
    status: "draft",
    is_customizable: false,
    
    // Variant fields
    size: null,
    color: null,
    hex_color: null,
    bat: null,
    poids: null,
    format: null,
    quantite: null,
    echantillon: null,
    types_impression: null,
    type_de_materiaux: null,
    details_impression: null,
    orientation_impression: null,
    stock: 0,
    price_adjustment: 0,
    variant_status: "in_stock",
    variant_image_url: null
  });
  
  // Fetch product data on component mount
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from("products_complete")
          .select("*")
          .eq("id", productId)
          .single();
        
        if (error) {
          toast.error("Erreur lors du chargement du produit");
          console.error("Error fetching product:", error);
          setIsLoading(false);
          return;
        }
        
        if (data) {
          setProductData({
            ...data,
            description: data.description || null,
            subcategory: data.subcategory || null,
            original_price: data.original_price || null,
            size: data.size || null,
            color: data.color || null,
            hex_color: data.hex_color || null,
            bat: data.bat || null,
            poids: data.poids || null,
            format: data.format || null,
            quantite: data.quantite || null,
            echantillon: data.echantillon || null,
            types_impression: data.types_impression || null,
            type_de_materiaux: data.type_de_materiaux || null,
            details_impression: data.details_impression || null,
            orientation_impression: data.orientation_impression || null,
            stock: data.stock || 0,
            price_adjustment: data.price_adjustment || 0,
            variant_status: data.variant_status || "in_stock",
            variant_image_url: data.variant_image_url || null
          });
          
          if (data.image) {
            setImagePreview(data.image);
          }
        }
      } catch (error) {
        console.error("Error in fetchProduct:", error);
        toast.error("Une erreur s'est produite");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'number') {
      setProductData(prev => ({
        ...prev,
        [name]: value === '' ? null : Number(value)
      }));
    } else {
      setProductData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setProductData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Handle image upload
  const handleImageChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    } else {
      setImagePreview(null);
      setImageFile(null);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    setIsSaving(true);
    
    try {
      let imageUrl = productData.image;
      
      // Upload image if a new one was selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `product-images/${fileName}`;
        
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('public')
          .upload(filePath, imageFile);
        
        if (uploadError) {
          toast.error("Erreur lors de l'upload de l'image");
          console.error("Error uploading image:", uploadError);
          setIsSaving(false);
          return;
        }
        
        // Get public URL
        const { data } = supabase.storage
          .from('public')
          .getPublicUrl(filePath);
        
        imageUrl = data.publicUrl;
      }
      
      // Prepare data for insertion/update
      const productToSave = {
        ...productData,
        image: imageUrl,
        id: productData.id || uuidv4(),
      };
      
      // Insert or update product
      const { error } = await supabase
        .from('products_complete')
        .upsert(productToSave, { onConflict: 'id' });
      
      if (error) {
        toast.error("Erreur lors de l'enregistrement du produit");
        console.error("Error saving product:", error);
        setIsSaving(false);
        return;
      }
      
      toast.success("Produit enregistré avec succès");
      navigate('/supplier/dashboard');
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error("Une erreur s'est produite");
    } finally {
      setIsSaving(false);
    }
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
