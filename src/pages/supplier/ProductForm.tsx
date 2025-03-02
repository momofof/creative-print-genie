import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Product, DatabaseProduct, ProductStatus } from '@/types/product';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { UploadCloud } from "lucide-react"

const ProductForm = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(undefined);
  const [image, setMainImage] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [isCustomizable, setIsCustomizable] = useState(false);
  const [status, setStatus] = useState<ProductStatus>('draft');
  const [productFile, setProductFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingProduct, setExistingProduct] = useState<DatabaseProduct | null>(null);

  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();

  useEffect(() => {
    if (productId) {
      setIsEditMode(true);
      fetchProductData(productId);
    }
  }, [productId]);

  const fetchProductData = async (productId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setExistingProduct(data);
        setName(data.name);
        setPrice(data.price);
        setOriginalPrice(data.originalPrice);
        setMainImage(data.image);
        setCategory(data.category);
        setSubcategory(data.subcategory);
        setDescription(data.description || '');
        setIsCustomizable(data.isCustomizable);
        setStatus(data.status);
      }
    } catch (error: any) {
      console.error("Error fetching product:", error);
      toast.error(error.message || "Failed to fetch product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData?.session) {
        navigate('/login');
        toast.error("Vous devez être connecté pour ajouter un produit.");
        return;
      }

      const { data: supplierData, error: supplierError } = await supabase
        .from('suppliers')
        .select('id')
        .eq('email', sessionData.session.user.email)
        .single();

      if (supplierError) {
        throw supplierError;
      }

      if (!supplierData) {
        toast.error("Impossible de trouver l'ID du fournisseur.");
        return;
      }

      const supplierId = supplierData.id;

      // Upload image if a new image file is selected
      let imageUrl = image;
      if (productFile) {
        const imagePath = `products/${supplierId}/${Date.now()}-${productFile.name}`;
        const { data: storageData, error: storageError } = await supabase.storage
          .from('images')
          .upload(imagePath, productFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (storageError) {
          throw storageError;
        }

        imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${imagePath}`;
      }

      const productData: Omit<DatabaseProduct, 'id' | 'createdAt' | 'updatedAt'> = {
        supplierId: supplierId,
        name,
        price,
        originalPrice,
        image: imageUrl,
        category,
        subcategory,
        description,
        isCustomizable,
        status,
      };

      if (isEditMode && existingProduct) {
        const { error: updateError } = await supabase
          .from('products')
          .update(productData)
          .eq('id', existingProduct.id);

        if (updateError) {
          throw updateError;
        }
        toast.success("Produit mis à jour avec succès!");
      } else {
        const { error: insertError } = await supabase
          .from('products')
          .insert([productData]);

        if (insertError) {
          throw insertError;
        }
        toast.success("Produit ajouté avec succès!");
      }

      navigate('/pro');
    } catch (error: any) {
      console.error("Error creating/updating product:", error);
      toast.error(error.message || "Failed to create/update product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement> | Event) => {
    const target = e.target as HTMLInputElement;
    const files = target.files;
    
    if (files && files.length > 0) {
      const newImage = files[0];
      const imageUrl = URL.createObjectURL(newImage);
      
      setMainImage(imageUrl);
      setProductFile(newImage);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <Navigation />
      <div className="container py-16 px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">{isEditMode ? 'Modifier le produit' : 'Ajouter un produit'}</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Name */}
                  <div>
                    <Label htmlFor="name">Nom du produit</Label>
                    <Input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <Label htmlFor="price">Prix</Label>
                    <Input
                      type="number"
                      id="price"
                      value={price.toString()}
                      onChange={(e) => setPrice(parseFloat(e.target.value))}
                      required
                    />
                  </div>

                  {/* Original Price */}
                  <div>
                    <Label htmlFor="originalPrice">Prix d'origine (facultatif)</Label>
                    <Input
                      type="number"
                      id="originalPrice"
                      value={originalPrice !== undefined ? originalPrice.toString() : ''}
                      onChange={(e) =>
                        setOriginalPrice(e.target.value ? parseFloat(e.target.value) : undefined)
                      }
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <Label htmlFor="category">Catégorie</Label>
                    <Input
                      type="text"
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    />
                  </div>

                  {/* Subcategory */}
                  <div>
                    <Label htmlFor="subcategory">Sous-catégorie</Label>
                    <Input
                      type="text"
                      id="subcategory"
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      required
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <Label htmlFor="status">Statut</Label>
                    <Select value={status} onValueChange={(value) => setStatus(value as ProductStatus)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Brouillon</SelectItem>
                        <SelectItem value="published">Publié</SelectItem>
                        <SelectItem value="archived">Archivé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                {/* Product Image */}
                <div>
                  <Label htmlFor="image">Image du produit</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="w-32 h-32 rounded-md overflow-hidden">
                      {image ? (
                        <img src={image} alt="Product" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          Aucune image
                        </div>
                      )}
                    </div>
                    <div>
                      <Input
                        type="file"
                        id="image"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <Label htmlFor="image" className="bg-accent text-accent-foreground rounded-full py-2 px-4 hover:bg-accent/90 cursor-pointer">
                        <UploadCloud className="h-4 w-4 mr-2 inline-block" />
                        Télécharger
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                {/* Description */}
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                {/* Is Customizable */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="isCustomizable">Personnalisable</Label>
                  <Switch
                    id="isCustomizable"
                    checked={isCustomizable}
                    onCheckedChange={(checked) => setIsCustomizable(checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button disabled={isLoading} className="w-full">
              {isLoading ? 'Enregistrement...' : (isEditMode ? 'Mettre à jour le produit' : 'Ajouter le produit')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
