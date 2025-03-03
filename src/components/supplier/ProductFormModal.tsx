import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import UploadDesignArea from "@/components/customize/UploadDesignArea";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: string;
  onProductSaved: () => void;
}

const ProductFormModal = ({ isOpen, onClose, productId, onProductSaved }: ProductFormModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    original_price: "",
    stock: "0",
    is_customizable: false,
    status: "draft" as "draft" | "published" | "archived"
  });

  useEffect(() => {
    if (productId) {
      setIsLoading(true);
      fetchProduct(productId);
    } else {
      resetForm();
    }
  }, [productId]);

  const fetchProduct = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      if (data) {
        setFormData({
          name: data.name || "",
          description: data.description || "",
          category: data.category || "",
          subcategory: data.subcategory || "",
          price: data.price ? String(data.price) : "",
          original_price: data.original_price ? String(data.original_price) : "",
          stock: data.stock ? String(data.stock) : "0",
          is_customizable: data.is_customizable || false,
          status: data.status || "draft"
        });
        setImageUrl(data.image || "");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Impossible de récupérer les données du produit");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      subcategory: "",
      price: "",
      original_price: "",
      stock: "0",
      is_customizable: false,
      status: "draft"
    });
    setImageUrl("");
    setUploadedImage(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "status") {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value as "draft" | "published" | "archived" 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleImageUpload = async (file: File) => {
    setUploadedImage(file);
    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImageToStorage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from('product_images')
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from('product_images')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      let imageUrlToSave = imageUrl;
      
      if (uploadedImage) {
        imageUrlToSave = await uploadImageToStorage(uploadedImage);
      }

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error("Utilisateur non authentifié");
        return;
      }
      
      const productData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        stock: parseInt(formData.stock),
        is_customizable: formData.is_customizable,
        status: formData.status,
        image: imageUrlToSave,
        supplier_id: userData.user.id
      };
      
      let result;
      
      if (productId) {
        result = await supabase
          .from('products')
          .update(productData)
          .eq('id', productId);
      } else {
        result = await supabase
          .from('products')
          .insert(productData);
      }
      
      if (result.error) throw result.error;
      
      toast.success(productId ? "Produit mis à jour avec succès" : "Produit ajouté avec succès");
      onProductSaved();
      onClose();
      resetForm();
      
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(productId ? "Erreur lors de la mise à jour du produit" : "Erreur lors de l'ajout du produit");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {productId ? "Modifier le produit" : "Ajouter un nouveau produit"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du produit *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleSelectChange("category", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clothing">Vêtements</SelectItem>
                    <SelectItem value="accessories">Accessoires</SelectItem>
                    <SelectItem value="homegoods">Déco & Maison</SelectItem>
                    <SelectItem value="electronics">Électronique</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subcategory">Sous-catégorie</Label>
                <Input
                  id="subcategory"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix (€) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="original_price">Prix initial (€)</Label>
                <Input
                  id="original_price"
                  name="original_price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.original_price}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="published">Publié</SelectItem>
                    <SelectItem value="archived">Archivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2 pt-8">
                <input
                  type="checkbox"
                  id="is_customizable"
                  name="is_customizable"
                  checked={formData.is_customizable}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                />
                <Label htmlFor="is_customizable">Personnalisable</Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Image du produit</Label>
              {imageUrl && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Image actuelle:</p>
                  <img 
                    src={imageUrl} 
                    alt="Aperçu du produit" 
                    className="max-h-40 rounded border object-contain"
                  />
                </div>
              )}
              <UploadDesignArea onUpload={handleImageUpload} />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Enregistrement..." : productId ? "Mettre à jour" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormModal;
