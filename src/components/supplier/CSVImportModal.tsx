
import React, { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, FileSpreadsheet, Upload, CheckCircle2 } from "lucide-react";
import { Product, ProductVariant } from "@/types/dashboard";

interface CSVImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSuccess: () => void;
}

interface CSVProductData {
  name: string;
  price: number;
  original_price?: number;
  category: string;
  subcategory?: string;
  description?: string;
  status?: "draft" | "published" | "archived";
  is_customizable?: boolean;
  variants?: {
    size: string;
    color: string;
    hex_color: string;
    stock: number;
    price_adjustment?: number;
    status?: "in_stock" | "low_stock" | "out_of_stock";
  }[];
}

const CSVImportModal = ({ open, onOpenChange, onImportSuccess }: CSVImportModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    total: number;
    success: number;
    failed: number;
  } | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setImportStatus(null);
      setIsComplete(false);
    }
  };

  const parseCSV = (text: string): CSVProductData[] => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    
    const products: CSVProductData[] = [];
    let currentProduct: CSVProductData | null = null;
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(',').map(val => val.trim());
      
      // Check if this is a product line or variant line
      if (values[0]) { // New product
        if (currentProduct) {
          products.push(currentProduct);
        }
        
        currentProduct = {
          name: values[headers.indexOf('name')],
          price: parseFloat(values[headers.indexOf('price')]),
          category: values[headers.indexOf('category')],
          variants: []
        };
        
        // Add optional fields
        const descriptionIndex = headers.indexOf('description');
        if (descriptionIndex !== -1 && values[descriptionIndex]) {
          currentProduct.description = values[descriptionIndex];
        }
        
        const originalPriceIndex = headers.indexOf('original_price');
        if (originalPriceIndex !== -1 && values[originalPriceIndex]) {
          currentProduct.original_price = parseFloat(values[originalPriceIndex]);
        }
        
        const subcategoryIndex = headers.indexOf('subcategory');
        if (subcategoryIndex !== -1 && values[subcategoryIndex]) {
          currentProduct.subcategory = values[subcategoryIndex];
        }
        
        const statusIndex = headers.indexOf('status');
        if (statusIndex !== -1 && values[statusIndex]) {
          const status = values[statusIndex] as "draft" | "published" | "archived";
          currentProduct.status = status;
        } else {
          currentProduct.status = "draft";
        }
        
        const customizableIndex = headers.indexOf('is_customizable');
        if (customizableIndex !== -1) {
          currentProduct.is_customizable = values[customizableIndex].toLowerCase() === 'true';
        }
      } else if (currentProduct && currentProduct.variants && values[headers.indexOf('size')]) {
        // This is a variant line
        const variant = {
          size: values[headers.indexOf('size')],
          color: values[headers.indexOf('color')],
          hex_color: values[headers.indexOf('hex_color')],
          stock: parseInt(values[headers.indexOf('stock')], 10) || 0
        };
        
        const priceAdjustmentIndex = headers.indexOf('price_adjustment');
        if (priceAdjustmentIndex !== -1 && values[priceAdjustmentIndex]) {
          variant['price_adjustment'] = parseFloat(values[priceAdjustmentIndex]);
        }
        
        const variantStatusIndex = headers.indexOf('variant_status');
        if (variantStatusIndex !== -1 && values[variantStatusIndex]) {
          variant['status'] = values[variantStatusIndex] as "in_stock" | "low_stock" | "out_of_stock";
        } else {
          variant['status'] = "in_stock";
        }
        
        currentProduct.variants.push(variant);
      }
    }
    
    // Add the last product
    if (currentProduct) {
      products.push(currentProduct);
    }
    
    return products;
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
          // Generate IDs for variants
          const variants = productData.variants?.map(variant => ({
            ...variant,
            id: crypto.randomUUID()
          })) || [];

          // Create product with variants in the product master table
          const { error: productError } = await supabase
            .from("products_master")
            .insert({
              id: nextId.toString(),  // Add the sequential ID here
              name: productData.name,
              price: productData.price,
              original_price: productData.original_price || null,
              category: productData.category,
              subcategory: productData.subcategory || null,
              description: productData.description || null,
              status: productData.status || "draft",
              is_customizable: productData.is_customizable || false,
              supplier_id: userData.user.id,
              variants: variants
            });
          
          if (productError) throw productError;
          
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

  const handleClose = () => {
    if (!isLoading) {
      reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importer des produits</DialogTitle>
          <DialogDescription>
            Importez vos produits et leurs variantes à partir d'un fichier CSV.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {!isComplete ? (
            <>
              <div className="flex items-center border rounded-md p-4 bg-gray-50">
                <FileSpreadsheet className="h-8 w-8 text-teal-600 mr-3" />
                <div>
                  <p className="text-sm font-medium">Format du fichier CSV</p>
                  <p className="text-xs text-gray-500">Colonnes: name, price, category, subcategory, status, description, original_price, is_customizable, size, color, hex_color, stock, price_adjustment, variant_status</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Fichier CSV</label>
                <Input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleFileChange}
                  disabled={isLoading}
                  className="cursor-pointer"
                />
              </div>
              
              {file && (
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium mr-1">{file.name}</span>
                  ({Math.round(file.size / 1024)} Ko)
                </div>
              )}
              
              {importStatus && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Total:</span>
                    <span className="font-medium">{importStatus.total}</span>
                  </div>
                  
                  {importStatus.success > 0 && (
                    <div className="flex justify-between text-sm text-green-600 mb-2">
                      <span>Réussis:</span>
                      <span className="font-medium">{importStatus.success}</span>
                    </div>
                  )}
                  
                  {importStatus.failed > 0 && (
                    <div className="flex justify-between text-sm text-red-600">
                      <span>Échecs:</span>
                      <span className="font-medium">{importStatus.failed}</span>
                    </div>
                  )}
                  
                  <div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-teal-600 rounded-full"
                      style={{ width: `${Math.floor((importStatus.success + importStatus.failed) / importStatus.total * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="rounded-full bg-green-100 p-3 mb-3">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Importation terminée</h3>
              <p className="text-sm text-gray-500 text-center mb-4">
                {importStatus?.success} produits importés avec succès,{' '}
                {importStatus?.failed} échecs.
              </p>
              <Button onClick={handleClose} className="w-full">
                Fermer
              </Button>
            </div>
          )}
        </div>
        
        {!isComplete && (
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={handleClose} 
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              onClick={importProducts}
              disabled={!file || isLoading}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Importation...
                </span>
              ) : (
                <span className="flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Importer
                </span>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CSVImportModal;
