import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { toJsonValue } from "@/utils/jsonUtils";
import { ProductData, ProductVariant, ProductFormState } from "./types/productTypes";
import { uploadProductImage, getNextProductId } from "./utils/productFormUtils";

interface UseProductFormHandlersProps {
  state: ProductFormState;
  setState: React.Dispatch<React.SetStateAction<ProductFormState>>;
  productId?: string;
}

export const useProductFormHandlers = ({ state, setState, productId }: UseProductFormHandlersProps) => {
  const navigate = useNavigate();
  const isEditing = !!productId;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setState(prev => ({
      ...prev,
      productData: {
        ...prev.productData,
        [name]: type === "number" ? parseFloat(value) || 0 : value
      }
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setState(prev => ({
      ...prev,
      productData: {
        ...prev.productData,
        [name]: value
      }
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setState(prev => ({
      ...prev,
      productData: {
        ...prev.productData,
        [name]: checked
      }
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setState(prev => ({
          ...prev,
          imageFile: file,
          imagePreview: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addVariant = () => {
    setState(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          size: "M",
          color: "Noir",
          hex_color: "#000000",
          stock: 0,
          price_adjustment: 0,
          status: "in_stock",
          isNew: true
        }
      ]
    }));
  };

  const removeVariant = (index: number) => {
    setState(prev => {
      const updatedVariants = [...prev.variants];
      
      // If it's an existing variant from the database, mark it for deletion
      if (updatedVariants[index].id) {
        updatedVariants[index] = {
          ...updatedVariants[index],
          isDeleted: true
        };
        return {
          ...prev,
          variants: updatedVariants
        };
      }
      
      // Otherwise just remove it from the array
      updatedVariants.splice(index, 1);
      return {
        ...prev,
        variants: updatedVariants
      };
    });
  };

  const handleVariantChange = (index: number, field: keyof ProductVariant, value: string | number) => {
    setState(prev => {
      const updatedVariants = [...prev.variants];
      updatedVariants[index] = {
        ...updatedVariants[index],
        [field]: field === "stock" || field === "price_adjustment" 
          ? parseFloat(value as string) || 0 
          : value
      };
      return {
        ...prev,
        variants: updatedVariants
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, isSaving: true }));
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        toast.error("Utilisateur non authentifié");
        navigate("/login");
        return;
      }
      
      // 1. Upload image if there's a new one
      const imageUrl = await uploadProductImage(state.imageFile, state.productData.image);
      
      // 2. Filter out deleted variants
      const activeVariants = state.variants.filter(variant => !variant.isDeleted);
      
      // 3. Create or update product in products_master table
      // Convert variants to Json compatible format
      const productPayload = {
        ...state.productData,
        supplier_id: userData.user.id,
        image: imageUrl || state.productData.image,
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
        // Get next sequential ID
        const nextId = await getNextProductId();
        
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
      setState(prev => ({ ...prev, isSaving: false }));
    }
  };

  return {
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
