
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { ProductData } from "./types/productTypes";
import { useVariantParser } from "./useVariantParser";

export const useProductForm = (productId?: string) => {
  const navigate = useNavigate();
  const { parseSimpleArrayString } = useVariantParser();
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
    variant_image_url: null,
    
    // Options arrays
    size_options: [],
    color_options: [],
    format_options: [],
    poids_options: [],
    bat_options: [],
    quantite_options: [],
    echantillon_options: [],
    types_impression_options: [],
    type_de_materiaux_options: [],
    details_impression_options: [],
    orientation_impression_options: []
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
          // Type assertion to ensure data status is compatible
          const typedStatus = (data.status as string === "draft" || 
                               data.status as string === "published" || 
                               data.status as string === "archived") 
                               ? data.status as "draft" | "published" | "archived" 
                               : "draft";
          
          // Type assertion for variant_status
          const typedVariantStatus = (data.variant_status as string === "in_stock" || 
                                     data.variant_status as string === "low_stock" || 
                                     data.variant_status as string === "out_of_stock") 
                                     ? data.variant_status as "in_stock" | "low_stock" | "out_of_stock" 
                                     : "in_stock";
          
          // Parse options to ensure they are arrays
          const { standardizeToArray } = useVariantParser();
          
          // Fonction pour standardiser les options de variantes
          const parseOptions = (optionsValue: any): string[] => {
            if (!optionsValue) return [];
            if (Array.isArray(optionsValue)) return optionsValue;
            if (typeof optionsValue === "string") return parseSimpleArrayString(optionsValue);
            return [];
          };
          
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
            // Here's the fix: use customization_price_adjustment from DB as price_adjustment in our app
            price_adjustment: data.customization_price_adjustment || 0,
            status: typedStatus,
            variant_status: typedVariantStatus,
            variant_image_url: data.variant_image_url || null,
            // Options de variantes - s'assurer qu'elles sont toujours des tableaux
            color_options: parseOptions(data.color_options),
            size_options: parseOptions(data.size_options),
            format_options: parseOptions(data.format_options),
            poids_options: parseOptions(data.poids_options),
            bat_options: parseOptions(data.bat_options),
            quantite_options: parseOptions(data.quantite_options),
            echantillon_options: parseOptions(data.echantillon_options),
            types_impression_options: parseOptions(data.types_impression_options),
            type_de_materiaux_options: parseOptions(data.type_de_materiaux_options),
            details_impression_options: parseOptions(data.details_impression_options),
            orientation_impression_options: parseOptions(data.orientation_impression_options)
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
  
  // Handle select changes - now accepting string or array value 
  const handleSelectChange = (name: string, value: string | string[]) => {
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
  
  // Nouvelle fonction pour traiter les entrées de tableau simple
  const handleArrayInput = (name: string, value: string) => {
    const optionsField = `${name}_options`;
    const parsedArray = parseSimpleArrayString(value);
    
    setProductData(prev => ({
      ...prev,
      [optionsField]: parsedArray
    }));
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
      const { arrayToSimpleString } = useVariantParser();
      
      // Convert array options to string format for database compatibility
      const convertOptionsForDb = (options: string[] | undefined): string => {
        if (!options || !Array.isArray(options) || options.length === 0) {
          return '';
        }
        return arrayToSimpleString(options);
      };
      
      // Prepare data object with correctly formatted options for database
      const productToSave = {
        ...productData,
        image: imageUrl,
        id: productData.id || uuidv4(),
        // Map price_adjustment from our app to customization_price_adjustment in DB during save
        customization_price_adjustment: productData.price_adjustment,
        // Convert array options to string format for database
        color_options: convertOptionsForDb(productData.color_options),
        size_options: convertOptionsForDb(productData.size_options),
        format_options: convertOptionsForDb(productData.format_options),
        poids_options: convertOptionsForDb(productData.poids_options),
        bat_options: convertOptionsForDb(productData.bat_options),
        quantite_options: convertOptionsForDb(productData.quantite_options),
        echantillon_options: convertOptionsForDb(productData.echantillon_options),
        types_impression_options: convertOptionsForDb(productData.types_impression_options),
        type_de_materiaux_options: convertOptionsForDb(productData.type_de_materiaux_options),
        details_impression_options: convertOptionsForDb(productData.details_impression_options),
        orientation_impression_options: convertOptionsForDb(productData.orientation_impression_options)
      };
      
      // Insert or update product
      const { error } = await supabase
        .from('products_complete')
        .upsert(productToSave as any, { onConflict: 'id' });
      
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
    handleArrayInput,
    handleSubmit
  };
};
