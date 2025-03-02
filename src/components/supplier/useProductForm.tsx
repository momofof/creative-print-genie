
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ProductStatus, DatabaseProduct } from '@/types/product';

export const useProductForm = () => {
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
        // Map database field names to our component state
        const mappedData: DatabaseProduct = {
          id: data.id,
          supplierId: data.supplier_id,
          name: data.name,
          price: data.price,
          originalPrice: data.original_price,
          image: data.image,
          category: data.category,
          subcategory: data.subcategory || '',
          description: data.description || '',
          isCustomizable: data.is_customizable || false,
          status: data.status || 'draft',
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
        
        setExistingProduct(mappedData);
        setName(mappedData.name);
        setPrice(mappedData.price);
        setOriginalPrice(mappedData.originalPrice);
        setMainImage(mappedData.image || '');
        setCategory(mappedData.category);
        setSubcategory(mappedData.subcategory);
        setDescription(mappedData.description || '');
        setIsCustomizable(mappedData.isCustomizable);
        setStatus(mappedData.status);
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

      // Map our component state to database field names
      const productData = {
        supplier_id: supplierId,
        name,
        price,
        original_price: originalPrice,
        image: imageUrl,
        category,
        subcategory,
        description,
        is_customizable: isCustomizable,
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

  return {
    name,
    setName,
    price,
    setPrice,
    originalPrice,
    setOriginalPrice,
    image,
    category,
    setCategory,
    subcategory,
    setSubcategory,
    description,
    setDescription,
    isCustomizable,
    setIsCustomizable,
    status,
    setStatus,
    isLoading,
    isEditMode,
    handleSubmit,
    handleImageChange
  };
};
