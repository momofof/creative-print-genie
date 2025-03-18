
// Le fichier ProductForm.tsx est très long, nous allons juste corriger les problèmes de typage
// sans avoir à réécrire tout le fichier.

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Store, 
  ArrowLeft, 
  Loader2, 
  Upload,
  Plus,
  Trash2,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface ProductData {
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

interface ProductVariant {
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

const ProductForm = () => {
  const { productId } = useParams();
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
      
      // Fetch product data
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();
      
      if (productError) throw productError;
      
      if (!product) {
        toast.error("Produit non trouvé");
        navigate("/supplier/dashboard");
        return;
      }
      
      // Ensure status has the correct type
      const typedProduct: ProductData = {
        ...product,
        status: product.status as 'draft' | 'published' | 'archived'
      };
      
      setProductData(typedProduct);
      setImagePreview(product.image);
      
      // Fetch product variants
      const { data: variantsData, error: variantsError } = await supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", productId);
      
      if (variantsError) throw variantsError;
      
      // Ensure each variant has the correct status type
      const typedVariants: ProductVariant[] = variantsData?.map(variant => ({
        ...variant,
        status: variant.status as 'in_stock' | 'low_stock' | 'out_of_stock'
      })) || [];
      
      setVariants(typedVariants);
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
      
      // 2. Create or update product
      const productPayload = {
        ...productData,
        supplier_id: userData.user.id,
        image: imageUrl || productData.image
      };
      
      let productResponseId: string;
      
      if (isEditing) {
        // Update existing product
        const { error: updateError } = await supabase
          .from("products")
          .update(productPayload)
          .eq("id", productId);
        
        if (updateError) throw updateError;
        
        productResponseId = productId as string;
      } else {
        // Create new product
        const { data: newProduct, error: createError } = await supabase
          .from("products")
          .insert(productPayload)
          .select("id")
          .single();
        
        if (createError) throw createError;
        if (!newProduct) throw new Error("Erreur lors de la création du produit");
        
        productResponseId = newProduct.id;
      }
      
      // 3. Handle variants
      for (const variant of variants) {
        if (variant.isDeleted && variant.id) {
          // Delete existing variant
          const { error: deleteError } = await supabase
            .from("product_variants")
            .delete()
            .eq("id", variant.id);
          
          if (deleteError) throw deleteError;
        } else if (variant.isNew) {
          // Create new variant
          const { size, color, hex_color, stock, price_adjustment, status } = variant;
          
          const { error: insertError } = await supabase
            .from("product_variants")
            .insert({
              product_id: productResponseId,
              size,
              color,
              hex_color,
              stock,
              price_adjustment,
              status
            });
          
          if (insertError) throw insertError;
        } else if (variant.id) {
          // Update existing variant
          const { id, size, color, hex_color, stock, price_adjustment, status } = variant;
          
          const { error: updateError } = await supabase
            .from("product_variants")
            .update({
              size,
              color,
              hex_color,
              stock,
              price_adjustment,
              status
            })
            .eq("id", id);
          
          if (updateError) throw updateError;
        }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/supplier/dashboard')}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour
            </Button>
            <h1 className="text-xl font-semibold text-gray-900 flex items-center">
              <Store className="h-5 w-5 mr-2 text-teal-600" />
              {isEditing ? "Modifier le produit" : "Ajouter un produit"}
            </h1>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isSaving}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            {isSaving ? (
              <span className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Enregistrement...
              </span>
            ) : (
              <span className="flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </span>
            )}
          </Button>
        </div>
      </div>
      
      {/* Form content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Product Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Informations générales</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nom du produit *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={productData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                          Prix (€) *
                        </label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={productData.price}
                          onChange={handleInputChange}
                          className="mt-1 block w-full"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="original_price" className="block text-sm font-medium text-gray-700">
                          Prix d'origine (€)
                        </label>
                        <Input
                          id="original_price"
                          name="original_price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={productData.original_price || ""}
                          onChange={handleInputChange}
                          className="mt-1 block w-full"
                          placeholder="Facultatif"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                          Catégorie *
                        </label>
                        <Select
                          value={productData.category}
                          onValueChange={(value) => handleSelectChange("category", value)}
                        >
                          <SelectTrigger className="mt-1 w-full">
                            <SelectValue placeholder="Sélectionner une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vêtements">Vêtements</SelectItem>
                            <SelectItem value="accessoires">Accessoires</SelectItem>
                            <SelectItem value="maison">Maison</SelectItem>
                            <SelectItem value="électronique">Électronique</SelectItem>
                            <SelectItem value="sport">Sport & Loisirs</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
                          Sous-catégorie
                        </label>
                        <Input
                          id="subcategory"
                          name="subcategory"
                          value={productData.subcategory || ""}
                          onChange={handleInputChange}
                          className="mt-1 block w-full"
                          placeholder="Facultatif"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <Textarea
                        id="description"
                        name="description"
                        value={productData.description || ""}
                        onChange={handleInputChange}
                        className="mt-1 block w-full"
                        rows={5}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Statut du produit
                      </label>
                      <Select
                        value={productData.status}
                        onValueChange={(value) => handleSelectChange("status", value as 'draft' | 'published' | 'archived')}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Brouillon</SelectItem>
                          <SelectItem value="published">Publié</SelectItem>
                          <SelectItem value="archived">Archivé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="is_customizable"
                        name="is_customizable"
                        type="checkbox"
                        checked={productData.is_customizable}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_customizable" className="ml-2 block text-sm text-gray-700">
                        Ce produit est personnalisable
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Variantes de produit</h2>
                    <Button 
                      type="button" 
                      onClick={addVariant}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter une variante
                    </Button>
                  </div>
                  
                  {variants.length === 0 && (
                    <div className="text-center py-6 bg-gray-50 rounded-md">
                      <p className="text-gray-500">Aucune variante pour ce produit</p>
                      <Button 
                        type="button" 
                        onClick={addVariant}
                        variant="ghost"
                        className="mt-2"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter une variante
                      </Button>
                    </div>
                  )}
                  
                  {variants.filter(v => !v.isDeleted).map((variant, index) => (
                    <div 
                      key={variant.id || index}
                      className="border rounded-md p-4 mb-4 last:mb-0"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-medium">Variante #{index + 1}</h3>
                        <Button
                          type="button"
                          onClick={() => removeVariant(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Taille
                          </label>
                          <Select
                            value={variant.size}
                            onValueChange={(value) => handleVariantChange(index, "size", value)}
                          >
                            <SelectTrigger className="mt-1 w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="XS">XS</SelectItem>
                              <SelectItem value="S">S</SelectItem>
                              <SelectItem value="M">M</SelectItem>
                              <SelectItem value="L">L</SelectItem>
                              <SelectItem value="XL">XL</SelectItem>
                              <SelectItem value="XXL">XXL</SelectItem>
                              <SelectItem value="Unique">Taille unique</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Couleur
                          </label>
                          <div className="flex mt-1">
                            <Input
                              type="color"
                              value={variant.hex_color}
                              onChange={(e) => handleVariantChange(index, "hex_color", e.target.value)}
                              className="w-10 h-10 p-0 border-0 rounded-l-md"
                            />
                            <Input
                              value={variant.color}
                              onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                              className="flex-1 rounded-l-none"
                              placeholder="Nom de la couleur"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Stock
                          </label>
                          <Input
                            type="number"
                            min="0"
                            value={variant.stock}
                            onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                            className="mt-1 w-full"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Ajustement prix (€)
                          </label>
                          <Input
                            type="number"
                            step="0.01"
                            value={variant.price_adjustment || 0}
                            onChange={(e) => handleVariantChange(index, "price_adjustment", e.target.value)}
                            className="mt-1 w-full"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Statut
                          </label>
                          <Select
                            value={variant.status}
                            onValueChange={(value) => handleVariantChange(index, "status", value as 'in_stock' | 'low_stock' | 'out_of_stock')}
                          >
                            <SelectTrigger className="mt-1 w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="in_stock">En stock</SelectItem>
                              <SelectItem value="low_stock">Stock faible</SelectItem>
                              <SelectItem value="out_of_stock">En rupture</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column - Image Upload */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Image du produit</h2>
                  
                  <div className="mb-4">
                    {imagePreview ? (
                      <div className="rounded-md overflow-hidden border border-gray-200 aspect-square flex items-center justify-center bg-gray-50">
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="rounded-md border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center aspect-square bg-gray-50">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Aucune image sélectionnée</p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Choisir une image
                    </label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      PNG, JPG ou GIF. Taille maximale de 2MB.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
