
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "@/integrations/supabase/storage";
import { toast } from "sonner";
import { ProductData, ProductVariant } from "@/types/supplier";

/**
 * Saves a product (create or update) to the database
 */
export const saveProduct = async (
  productData: ProductData,
  variants: ProductVariant[],
  imageFile: File | null,
  supplierId: string | null,
  isEditing: boolean,
  productId?: string
): Promise<string | undefined> => {
  if (!supplierId) {
    toast.error("Vous devez être connecté pour enregistrer un produit");
    return;
  }
  
  try {
    let imageUrl = productData.image;
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `products/${fileName}`;
      
      const uploadedUrl = await uploadImage('product-images', filePath, imageFile);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      }
    }
    
    let productIdToUse = isEditing ? productId : undefined;
    
    if (isEditing && productId) {
      const { error } = await supabase
        .from('products')
        .update({
          name: productData.name,
          price: productData.price,
          original_price: productData.original_price,
          category: productData.category,
          subcategory: productData.subcategory,
          description: productData.description,
          image: imageUrl,
          status: productData.status,
          is_customizable: productData.is_customizable,
          stock: productData.stock
        })
        .eq('id', productId);
        
      if (error) {
        throw error;
      }
    } else {
      const { data, error } = await supabase
        .from('products')
        .insert({
          supplier_id: supplierId,
          name: productData.name,
          price: productData.price,
          original_price: productData.original_price,
          category: productData.category,
          subcategory: productData.subcategory,
          description: productData.description,
          image: imageUrl,
          status: productData.status,
          is_customizable: productData.is_customizable,
          stock: productData.stock
        })
        .select('id')
        .single();
        
      if (error) {
        throw error;
      }
      
      if (data) {
        productIdToUse = data.id;
      }
    }
    
    if (productIdToUse) {
      await saveVariants(variants, productIdToUse);
    }
    
    toast.success(isEditing ? "Produit mis à jour avec succès" : "Produit créé avec succès");
    return productIdToUse;
  } catch (error: any) {
    console.error("Erreur lors de l'enregistrement du produit:", error);
    toast.error(error.message || "Erreur lors de l'enregistrement du produit");
    return undefined;
  }
};

/**
 * Saves product variants to the database
 */
export const saveVariants = async (
  variants: ProductVariant[],
  productId: string
): Promise<void> => {
  // Delete variants
  for (const variant of variants.filter(v => v.isDeleted && v.id)) {
    if (variant.id) {
      await supabase
        .from('product_variants')
        .delete()
        .eq('id', variant.id);
    }
  }
  
  // Update existing variants
  for (const variant of variants.filter(v => !v.isDeleted && !v.isNew && v.id)) {
    if (variant.id) {
      await supabase
        .from('product_variants')
        .update({
          size: variant.size,
          color: variant.color,
          hex_color: variant.hex_color,
          stock: variant.stock,
          price_adjustment: variant.price_adjustment,
          status: variant.status
        })
        .eq('id', variant.id);
    }
  }
  
  // Insert new variants
  const newVariants = variants.filter(v => !v.isDeleted && v.isNew);
  if (newVariants.length > 0) {
    await supabase
      .from('product_variants')
      .insert(
        newVariants.map(v => ({
          product_id: productId,
          size: v.size,
          color: v.color,
          hex_color: v.hex_color,
          stock: v.stock,
          price_adjustment: v.price_adjustment,
          status: v.status
        }))
      );
  }
};

/**
 * Imports product data from a CSV file
 */
export const importProducts = async (
  rows: string[], 
  headers: string[], 
  supplierId: string | null
): Promise<void> => {
  const products = [];
  
  for (let i = 1; i < rows.length; i++) {
    if (!rows[i].trim()) continue;
    
    const values = rows[i].split(',').map(v => v.trim());
    const product: any = {};
    
    headers.forEach((header, index) => {
      if (header === 'price' || header === 'original_price' || header === 'stock') {
        product[header] = parseFloat(values[index]) || 0;
      } else if (header === 'is_customizable') {
        product[header] = values[index].toLowerCase() === 'true';
      } else {
        product[header] = values[index];
      }
    });
    
    product.supplier_id = supplierId;
    
    products.push(product);
  }
  
  if (products.length === 0) {
    toast.error("Aucun produit à importer");
    return;
  }
  
  const { data, error } = await supabase
    .from('products')
    .insert(products);
    
  if (error) {
    console.error("Erreur lors de l'importation des produits:", error);
    toast.error("Erreur lors de l'importation des produits");
    return;
  }
  
  toast.success(`${products.length} produits importés avec succès`);
};

/**
 * Imports product variant data from a CSV file
 */
export const importVariants = async (
  rows: string[], 
  headers: string[], 
  productId: string
): Promise<void> => {
  const variants = [];
  
  for (let i = 1; i < rows.length; i++) {
    if (!rows[i].trim()) continue;
    
    const values = rows[i].split(',').map(v => v.trim());
    const variant: any = { product_id: productId };
    
    headers.forEach((header, index) => {
      if (header === 'stock' || header === 'price_adjustment') {
        variant[header] = parseFloat(values[index]) || 0;
      } else {
        variant[header] = values[index];
      }
    });
    
    variants.push(variant);
  }
  
  if (variants.length === 0) {
    toast.error("Aucune variante à importer");
    return;
  }
  
  const { data, error } = await supabase
    .from('product_variants')
    .insert(variants);
    
  if (error) {
    console.error("Erreur lors de l'importation des variantes:", error);
    toast.error("Erreur lors de l'importation des variantes");
    return;
  }
  
  toast.success(`${variants.length} variantes importées avec succès`);
};

/**
 * Fetches product data from the database
 */
export const fetchProductData = async (
  id: string,
  setProductData: (data: ProductData) => void,
  setVariants: (variants: ProductVariant[]) => void,
  setImagePreview: (url: string | null) => void
): Promise<void> => {
  try {
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (productError) {
      console.error("Erreur lors de la récupération du produit:", productError);
      toast.error("Erreur lors de la récupération du produit");
      return;
    }

    const { data: variantsData, error: variantsError } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', id);

    if (variantsError) {
      console.error("Erreur lors de la récupération des variantes:", variantsError);
      toast.error("Erreur lors de la récupération des variantes");
    }

    setProductData({
      name: productData.name,
      price: productData.price,
      original_price: productData.original_price,
      category: productData.category,
      subcategory: productData.subcategory,
      description: productData.description,
      image: productData.image,
      status: productData.status as 'draft' | 'published' | 'archived',
      is_customizable: productData.is_customizable || false,
      stock: productData.stock || 0
    });

    if (productData.image) {
      setImagePreview(productData.image);
    }

    if (variantsData) {
      const typedVariants: ProductVariant[] = variantsData.map(variant => ({
        id: variant.id,
        size: variant.size,
        color: variant.color,
        hex_color: variant.hex_color,
        stock: variant.stock || 0,
        price_adjustment: variant.price_adjustment,
        status: variant.status as 'in_stock' | 'low_stock' | 'out_of_stock'
      }));
      setVariants(typedVariants);
    }
  } catch (error) {
    console.error("Erreur inattendue:", error);
    toast.error("Une erreur inattendue s'est produite");
  }
};

/**
 * Processes an imported CSV file
 */
export const processCsvImport = async (
  file: File,
  type: "products" | "variants",
  productId: string | undefined,
  supplierId: string | null
): Promise<void> => {
  const reader = new FileReader();
  
  return new Promise<void>((resolve, reject) => {
    reader.onload = async (event) => {
      try {
        if (!event.target || !event.target.result) {
          toast.error("Erreur lors de la lecture du fichier");
          reject(new Error("Erreur lors de la lecture du fichier"));
          return;
        }

        const csvText = event.target.result.toString();
        const rows = csvText.split('\n');
        const headers = rows[0].split(',').map(h => h.trim());
        
        if (type === "products") {
          await importProducts(rows, headers, supplierId);
        } else {
          if (!productId) {
            toast.error("L'ID du produit est requis pour importer des variantes");
            reject(new Error("ID de produit manquant"));
            return;
          }
          await importVariants(rows, headers, productId);
        }
        
        resolve();
      } catch (error) {
        console.error("Erreur lors de l'importation:", error);
        toast.error("Erreur lors de l'importation du fichier CSV");
        reject(error);
      }
    };
    
    reader.readAsText(file);
  });
};
