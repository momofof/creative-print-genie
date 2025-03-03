import { useState, useEffect, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Trash2,
  AlertCircle,
  Image,
  Upload,
  Plus,
  Minus,
  X,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import LoadingSpinner from "@/components/profile/LoadingSpinner";
import { DatabaseProduct, ProductVariant } from "@/types/product";

const productSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  description: z.string().optional(),
  price: z.coerce.number().min(0.01, "Le prix doit être supérieur à 0"),
  originalPrice: z.coerce.number().optional(),
  category: z.string().min(1, "La catégorie est requise"),
  subcategory: z.string().optional(),
  isCustomizable: z.boolean().default(false),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

const AVAILABLE_COLORS = [
  { name: "Noir", hex: "#000000" },
  { name: "Blanc", hex: "#FFFFFF" },
  { name: "Gris", hex: "#808080" },
  { name: "Bleu", hex: "#0000FF" },
  { name: "Rouge", hex: "#FF0000" },
  { name: "Vert", hex: "#008000" },
  { name: "Jaune", hex: "#FFFF00" },
  { name: "Orange", hex: "#FFA500" },
  { name: "Violet", hex: "#800080" },
  { name: "Rose", hex: "#FFC0CB" },
  { name: "Marron", hex: "#A52A2A" },
  { name: "Beige", hex: "#F5F5DC" }
];

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

const PRODUCT_CATEGORIES = [
  { id: "t-shirts", name: "T-shirts" },
  { id: "sweatshirts", name: "Sweat-shirts" },
  { id: "hoodies", name: "Hoodies" },
  { id: "polos", name: "Polos" },
  { id: "accessories", name: "Accessoires" },
  { id: "bags", name: "Sacs" },
  { id: "hats", name: "Casquettes et chapeaux" },
  { id: "kids", name: "Vêtements enfants" },
];

const SUBCATEGORIES = {
  "t-shirts": [
    "T-shirt manches courtes",
    "T-shirt manches longues",
    "T-shirt col V",
    "T-shirt col rond",
    "Débardeur",
  ],
  "sweatshirts": ["Sweat à capuche", "Sweat sans capuche", "Sweat zippé"],
  "hoodies": ["Hoodie simple", "Hoodie zippé", "Hoodie oversize"],
  "polos": ["Polo coton", "Polo performance", "Polo manches longues"],
  "accessories": ["Masques", "Gants", "Écharpes", "Coques de téléphone"],
  "bags": ["Tote bags", "Sacs à dos", "Sacs de sport", "Pochettes"],
  "hats": ["Casquettes", "Bonnets", "Chapeaux", "Visières"],
  "kids": ["T-shirts enfants", "Sweats enfants", "Bodys bébés"],
};

type ProductFormValue = z.infer<typeof productSchema>;

export default function ProductForm() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [originalProduct, setOriginalProduct] = useState<DatabaseProduct | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [views, setViews] = useState<{id?: string, name: string, image: string, order: number}[]>([
    { name: "Face avant", image: "", order: 1 }
  ]);

  const isEditing = Boolean(productId);

  const form = useForm<ProductFormValue>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      originalPrice: undefined,
      category: "",
      subcategory: "",
      isCustomizable: false,
      status: "draft",
    },
  });

  useEffect(() => {
    const checkAuthentication = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/login", { replace: true });
        toast.error("Vous devez être connecté pour accéder à cette page");
        return;
      }
      
      if (isEditing) {
        fetchProductData();
      }
    };

    checkAuthentication();
  }, [productId, navigate, isEditing]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const { data: product, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) throw error;

      const formattedProduct: DatabaseProduct = {
        id: product.id,
        supplierId: product.supplier_id,
        name: product.name,
        description: product.description || "",
        price: Number(product.price),
        originalPrice: product.original_price ? Number(product.original_price) : undefined,
        image: product.image || "",
        category: product.category,
        subcategory: product.subcategory || "",
        isCustomizable: product.is_customizable,
        status: product.status,
        createdAt: product.created_at,
        updatedAt: product.updated_at
      };

      setOriginalProduct(formattedProduct);
      
      form.reset({
        name: formattedProduct.name,
        description: formattedProduct.description,
        price: formattedProduct.price,
        originalPrice: formattedProduct.originalPrice,
        category: formattedProduct.category,
        subcategory: formattedProduct.subcategory,
        isCustomizable: formattedProduct.isCustomizable,
        status: formattedProduct.status,
      });
      
      if (formattedProduct.image) {
        setImagePreview(formattedProduct.image);
      }
      
      setSelectedCategory(formattedProduct.category);
      
      fetchProductVariants();
      
      fetchProductViews();
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Erreur lors du chargement du produit");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductVariants = async () => {
    try {
      const { data, error } = await supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", productId)
        .order("size", { ascending: true });

      if (error) throw error;

      const formattedVariants: ProductVariant[] = data.map(item => ({
        id: item.id,
        productId: item.product_id,
        size: item.size,
        color: item.color,
        hexColor: item.hex_color,
        stock: item.stock,
        priceAdjustment: Number(item.price_adjustment),
        status: item.status,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));

      setVariants(formattedVariants);
    } catch (error) {
      console.error("Error fetching product variants:", error);
    }
  };

  const fetchProductViews = async () => {
    try {
      const { data, error } = await supabase
        .from("product_views")
        .select("*")
        .eq("product_id", productId)
        .order("order", { ascending: true });

      if (error) throw error;

      const formattedViews = data.map(item => ({
        id: item.id,
        name: item.name,
        image: item.image,
        order: item.order
      }));

      if (formattedViews.length > 0) {
        setViews(formattedViews);
      }
    } catch (error) {
      console.error("Error fetching product views:", error);
    }
  };

  const handleCategoryChange = (value: string) => {
    form.setValue("category", value);
    form.setValue("subcategory", "");
    setSelectedCategory(value);
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    try {
      setUploadingImage(true);
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (error) throw error;

      const { data: publicURL } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);

      setImagePreview(publicURL.publicUrl);
      toast.success("Image téléchargée avec succès");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Erreur lors du téléchargement de l'image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleViewImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    try {
      setUploadingImage(true);
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `views/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (error) throw error;

      const { data: publicURL } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);

      const updatedViews = [...views];
      updatedViews[index].image = publicURL.publicUrl;
      setViews(updatedViews);
      
      toast.success("Image de vue téléchargée avec succès");
    } catch (error) {
      console.error("Error uploading view image:", error);
      toast.error("Erreur lors du téléchargement de l'image de vue");
    } finally {
      setUploadingImage(false);
    }
  };

  const addVariant = () => {
    const newVariants = [
      ...variants,
      {
        id: `temp-${Date.now()}`,
        productId: productId || "",
        size: "M",
        color: "Noir",
        hexColor: "#000000",
        stock: 10,
        priceAdjustment: 0,
        status: "in_stock" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    setVariants(newVariants);
  };

  const removeVariant = (index: number) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const newVariants = [...variants];
    
    if (field === 'color') {
      const selectedColor = AVAILABLE_COLORS.find(c => c.name === value);
      if (selectedColor) {
        newVariants[index].color = selectedColor.name;
        newVariants[index].hexColor = selectedColor.hex;
      }
    } else {
      (newVariants[index][field] as any) = value;
    }
    
    setVariants(newVariants);
  };

  const addView = () => {
    const newViews = [
      ...views,
      {
        name: `Vue ${views.length + 1}`,
        image: "",
        order: views.length + 1
      }
    ];
    setViews(newViews);
  };

  const removeView = (index: number) => {
    if (views.length <= 1) {
      toast.error("Vous devez avoir au moins une vue pour le produit");
      return;
    }
    
    const newViews = [...views];
    newViews.splice(index, 1);
    
    newViews.forEach((view, idx) => {
      view.order = idx + 1;
    });
    
    setViews(newViews);
  };

  const updateView = (index: number, field: 'name', value: string) => {
    const newViews = [...views];
    newViews[index][field] = value;
    setViews(newViews);
  };

  const onSubmit = async (data: ProductFormValue) => {
    if (!imagePreview) {
      toast.error("Veuillez télécharger une image pour le produit");
      return;
    }
    
    if (data.isCustomizable && !views.some(view => view.image)) {
      toast.error("Pour un produit personnalisable, au moins une vue doit avoir une image");
      return;
    }

    try {
      setSubmitting(true);
      
      const productData = {
        name: data.name,
        description: data.description,
        price: data.price,
        original_price: data.originalPrice || null,
        image: imagePreview,
        category: data.category,
        subcategory: data.subcategory || null,
        is_customizable: data.isCustomizable,
        status: data.status
      };
      
      let productId;
      
      if (isEditing) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", originalProduct?.id);
        
        if (error) throw error;
        
        productId = originalProduct?.id;
        toast.success("Produit mis à jour avec succès");
      } else {
        const { data: newProduct, error } = await supabase
          .from("products")
          .insert([{
            ...productData,
            supplier_id: (await supabase.auth.getUser()).data.user?.id
          }])
          .select()
          .single();
        
        if (error) throw error;
        
        productId = newProduct.id;
        toast.success("Produit créé avec succès");
      }
      
      if (productId) {
        await processVariants(productId);
        
        if (data.isCustomizable) {
          await processViews(productId);
        }
      }
      
      navigate("/supplier/dashboard");
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Erreur lors de l'enregistrement du produit");
    } finally {
      setSubmitting(false);
    }
  };

  const processVariants = async (productId: string) => {
    try {
      if (isEditing) {
        await supabase
          .from("product_variants")
          .delete()
          .eq("product_id", productId);
      }
      
      if (variants.length > 0) {
        const variantsToInsert = variants.map(variant => ({
          product_id: productId,
          size: variant.size,
          color: variant.color,
          hex_color: variant.hexColor,
          stock: variant.stock,
          price_adjustment: variant.priceAdjustment,
          status: variant.status
        }));
        
        const { error } = await supabase
          .from("product_variants")
          .insert(variantsToInsert);
        
        if (error) throw error;
      }
    } catch (error) {
      console.error("Error processing variants:", error);
      throw error;
    }
  };

  const processViews = async (productId: string) => {
    try {
      if (isEditing) {
        await supabase
          .from("product_views")
          .delete()
          .eq("product_id", productId);
      }
      
      if (views.length > 0) {
        const viewsToInsert = views.map(view => ({
          product_id: productId,
          name: view.name,
          image: view.image,
          order: view.order
        }));
        
        const { error } = await supabase
          .from("product_views")
          .insert(viewsToInsert);
        
        if (error) throw error;
      }
    } catch (error) {
      console.error("Error processing views:", error);
      throw error;
    }
  };

  const deleteProduct = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.")) {
      return;
    }
    
    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);
      
      if (error) throw error;
      
      toast.success("Produit supprimé avec succès");
      navigate("/supplier/dashboard");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Erreur lors de la suppression du produit");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-24 flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-24">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/supplier/dashboard")} 
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold">
            {isEditing ? "Modifier le produit" : "Ajouter un produit"}
          </h1>
        </div>
        
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="details">Détails du produit</TabsTrigger>
            <TabsTrigger value="variants">Variantes et stock</TabsTrigger>
            {form.watch("isCustomizable") && (
              <TabsTrigger value="customization">Personnalisation</TabsTrigger>
            )}
          </TabsList>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <TabsContent value="details" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <Card className="lg:col-span-1">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center">
                        <div className="w-full h-64 mb-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                          {imagePreview ? (
                            <div className="relative w-full h-full">
                              <img 
                                src={imagePreview} 
                                alt="Product" 
                                className="w-full h-full object-contain" 
                              />
                              <button
                                type="button"
                                onClick={() => setImagePreview(null)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                title="Supprimer l'image"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="text-center p-6">
                              <Image className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-gray-500 mb-4">
                                PNG, JPG, GIF jusqu'à 10MB
                              </p>
                              <label className="cursor-pointer">
                                <span className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 inline-flex items-center">
                                  <Upload className="h-4 w-4 mr-2" />
                                  Télécharger
                                </span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  disabled={uploadingImage}
                                />
                              </label>
                            </div>
                          )}
                        </div>
                        
                        {uploadingImage && (
                          <div className="w-full text-center">
                            <LoadingSpinner size="small" />
                            <p className="text-sm text-gray-500">Téléchargement en cours...</p>
                          </div>
                        )}
                        
                        {imagePreview && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e) => handleImageUpload(e as ChangeEvent<HTMLInputElement>);
                              input.click();
                            }}
                            disabled={uploadingImage}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Changer l'image
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="lg:col-span-2">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom du produit</FormLabel>
                              <FormControl>
                                <Input placeholder="T-shirt Premium Unisexe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Description détaillée du produit"
                                  rows={5}
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Prix (€)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="0.01" 
                                    step="0.01" 
                                    placeholder="19.99" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="originalPrice"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Prix original (€) - Optionnel</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="0" 
                                    step="0.01" 
                                    placeholder="24.99" 
                                    {...field} 
                                    value={field.value || ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Catégorie</FormLabel>
                                <Select
                                  onValueChange={handleCategoryChange}
                                  defaultValue={field.value}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Sélectionner une catégorie" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {PRODUCT_CATEGORIES.map((category) => (
                                      <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="subcategory"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Sous-catégorie</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  value={field.value || ""}
                                  disabled={!selectedCategory}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Sélectionner une sous-catégorie" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {selectedCategory && SUBCATEGORIES[selectedCategory as keyof typeof SUBCATEGORIES]?.map((subcat) => (
                                      <SelectItem key={subcat} value={subcat}>
                                        {subcat}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="flex flex-col space-y-4">
                          <FormField
                            control={form.control}
                            name="isCustomizable"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Produit personnalisable</FormLabel>
                                  <p className="text-sm text-gray-500">
                                    Permettre aux clients de personnaliser ce produit
                                  </p>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Statut</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Statut du produit" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="draft">Brouillon</SelectItem>
                                    <SelectItem value="published">Publié</SelectItem>
                                    <SelectItem value="archived">Archivé</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="variants" className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-medium">Variantes et stock</h3>
                      <Button type="button" onClick={addVariant} variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter une variante
                      </Button>
                    </div>
                    
                    {variants.length === 0 ? (
                      <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <p className="text-gray-500 mb-4">Aucune variante ajoutée</p>
                        <Button type="button" onClick={addVariant}>
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter une variante
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {variants.map((variant, index) => (
                          <div key={variant.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-medium">Variante {index + 1}</h4>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeVariant(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Taille
                                </label>
                                <Select 
                                  value={variant.size} 
                                  onValueChange={(value) => updateVariant(index, 'size', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Taille" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {AVAILABLE_SIZES.map((size) => (
                                      <SelectItem key={size} value={size}>
                                        {size}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Couleur
                                </label>
                                <Select 
                                  value={variant.color} 
                                  onValueChange={(value) => updateVariant(index, 'color', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Couleur" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {AVAILABLE_COLORS.map((color) => (
                                      <SelectItem key={color.name} value={color.name}>
                                        <div className="flex items-center">
                                          <div 
                                            className="w-4 h-4 rounded-full mr-2" 
                                            style={{ 
                                              backgroundColor: color.hex,
                                              border: color.name === 'Blanc' ? '1px solid #e5e7eb' : 'none'
                                            }} 
                                          />
                                          {color.name}
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Stock
                                </label>
                                <Input 
                                  type="number" 
                                  min="0" 
                                  value={variant.stock} 
                                  onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)} 
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Ajustement de prix (€)
                                </label>
                                <Input 
                                  type="number" 
                                  step="0.01"
                                  value={variant.priceAdjustment} 
                                  onChange={(e) => updateVariant(index, 'priceAdjustment', parseFloat(e.target.value) || 0)} 
                                />
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Statut
                              </label>
                              <Select 
                                value={variant.status} 
                                onValueChange={(value) => updateVariant(index, 'status', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Statut" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="in_stock">En stock</SelectItem>
                                  <SelectItem value="low_stock">Stock faible</SelectItem>
                                  <SelectItem value="out_of_stock">Épuisé</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <Alert className="mt-6 bg-blue-50">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-600">
                        Si vous n'ajoutez pas de variantes, le produit sera disponible dans toutes les tailles et couleurs par défaut.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {form.watch("isCustomizable") && (
                <TabsContent value="customization" className="mt-0">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-medium">Vues personnalisables</h3>
                        <Button type="button" onClick={addView} variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter une vue
                        </Button>
                      </div>
                      
                      <Alert className="mb-6 bg-yellow-50">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <AlertDescription className="text-yellow-600">
                          Les vues permettent aux clients de visualiser leur personnalisation sous différents angles. Veuillez ajouter au moins une vue avec une image claire du produit.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="space-y-6">
                        {views.map((view, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex justify-between items-center mb-4">
                              <div className="flex items-center">
                                <h4 className="font-medium">Vue {index + 1}</h4>
                                {index === 0 && (
                                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                    Vue principale
                                  </span>
                                )}
                              </div>
                              {index > 0 && (
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => removeView(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Supprimer
                                </Button>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Nom de la vue
                                </label>
                                <Input 
                                  value={view.name} 
                                  onChange={(e) => updateView(index, 'name', e.target.value)} 
                                  placeholder="ex: Face avant"
                                />
                              </div>
                              
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Image de la vue
                                </label>
                                <div className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden flex items-center justify-center">
                                  {view.image ? (
                                    <div className="relative w-full h-full">
                                      <img 
                                        src={view.image} 
                                        alt={view.name} 
                                        className="w-full h-full object-contain" 
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updatedViews = [...views];
                                          updatedViews[index].image = "";
                                          setViews(updatedViews);
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                        title="Supprimer l'image"
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="text-center p-4">
                                      <Image className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                      <p className="text-xs text-gray-500 mb-2">
                                        PNG, JPG, GIF jusqu'à 10MB
                                      </p>
                                      <label className="cursor-pointer">
                                        <span className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 inline-flex items-center text-sm">
                                          <Upload className="h-3 w-3 mr-2" />
                                          Télécharger
                                        </span>
                                        <input
                                          type="file"
                                          className="hidden"
                                          accept="image/*"
                                          onChange={(e) => handleViewImageUpload(e, index)}
                                          disabled={uploadingImage}
                                        />
                                      </label>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
              
              <div className="mt-6 flex justify-between">
                {isEditing && (
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={deleteProduct}
                    disabled={submitting}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer le produit
                  </Button>
                )}
                
                <div className="flex gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate("/supplier/dashboard")}
                    disabled={submitting}
                  >
                    Annuler
                  </Button>
                  
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <LoadingSpinner size="small" className="mr-2" />
                        Enregistrement...
                      </>
                    ) : (
                      isEditing ? "Mettre à jour" : "Créer le produit"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </Tabs>
      </div>
    </div>
  );
}
