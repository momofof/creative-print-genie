
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { parseCSV, CSVProductData } from "./CSVParser";

interface UseCSVImportProps {
  onImportSuccess: () => void;
}

export const useCSVImport = ({ onImportSuccess }: UseCSVImportProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    total: number;
    success: number;
    failed: number;
  } | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const handleFileChange = (newFile: File) => {
    setFile(newFile);
    setImportStatus(null);
    setIsComplete(false);
  };

  const importProducts = async () => {
    if (!file) {
      toast.error("Veuillez sélectionner un fichier CSV");
      return;
    }

    setIsLoading(true);
    setImportStatus({ total: 0, success: 0, failed: 0 });

    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        toast.error("Utilisateur non authentifié");
        setIsLoading(false);
        return;
      }

      const text = await file.text();
      const products = parseCSV(text);
      
      setImportStatus(prev => ({ ...prev!, total: products.length, success: 0, failed: 0 }));
      
      // Get the highest current product ID to start generating sequential IDs
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
      
      for (const productData of products) {
        try {
          // Create product in the products_master table
          const { error: productError, data: newProduct } = await supabase
            .from("products_master")
            .insert({
              id: nextId.toString(),
              name: productData.name,
              price: productData.price,
              original_price: productData.original_price || null,
              category: productData.category,
              subcategory: productData.subcategory || null,
              description: productData.description || null,
              status: productData.status || "draft",
              is_customizable: productData.is_customizable || false,
              supplier_id: userData.user.id
            })
            .select('id')
            .single();
          
          if (productError) throw productError;
          
          // Insert variants into the product_variants table
          if (productData.variants && productData.variants.length > 0) {
            const variantsPayload = productData.variants.map(variant => ({
              product_id: nextId.toString(),
              size: variant.size,
              color: variant.color,
              hex_color: variant.hex_color,
              stock: variant.stock,
              price_adjustment: variant.price_adjustment || 0,
              status: variant.status || "in_stock",
              bat: variant.bat || null,
              poids: variant.poids || null,
              format: variant.format || null,
              quantite: variant.quantite || null,
              echantillon: variant.echantillon || null,
              types_impression: variant.types_impression || null,
              type_de_materiaux: variant.type_de_materiaux || null,
              details_impression: variant.details_impression || null,
              orientation_impression: variant.orientation_impression || null
            }));
            
            const { error: variantsError } = await supabase
              .from("product_variants")
              .insert(variantsPayload);
            
            if (variantsError) {
              console.error(`Erreur lors de l'importation des variantes pour le produit ${productData.name}:`, variantsError);
            }
          }
          
          nextId++; // Increment the ID for the next product
          setImportStatus(prev => ({ ...prev!, success: prev!.success + 1 }));
        } catch (error) {
          console.error(`Erreur lors de l'importation du produit ${productData.name}:`, error);
          setImportStatus(prev => ({ ...prev!, failed: prev!.failed + 1 }));
        }
      }
      
      setIsComplete(true);
      toast.success(`Importation terminée: ${importStatus?.success} produits importés, ${importStatus?.failed} échecs`);
      
      // Trigger refresh of products list
      onImportSuccess();
    } catch (error) {
      console.error("Erreur lors de l'importation:", error);
      toast.error("Une erreur est survenue lors de l'importation");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setImportStatus(null);
    setIsComplete(false);
  };

  return {
    file,
    isLoading,
    importStatus,
    isComplete,
    handleFileChange,
    importProducts,
    reset
  };
};
