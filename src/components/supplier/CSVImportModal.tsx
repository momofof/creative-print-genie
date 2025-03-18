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
import { Product } from "@/types/dashboard";

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
      
      for (const productData of products) {
        try {
          // Create product
          const { data: newProduct, error: productError } = await supabase
            .from("products")
            .insert({
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
            .select("id")
            .single();
          
          if (productError) throw productError;
          
          // Create variants if any
          if (productData.variants && productData.variants.length > 0) {
            const variantsToInsert = productData.variants.map(variant => ({
              product_id: newProduct.id,
              size: variant.size,
              color: variant.color,
              hex_color: variant.hex_color,
              stock: variant.stock,
              price_adjustment: variant.price_adjustment || 0,
              status: variant.status || "in_stock"
            }));
            
            const { error: variantsError } = await supabase
              .from("product_variants")
              .insert(variantsToInsert);
            
            if (variantsError) throw variantsError;
          }
          
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-teal-600" />
            Importer des produits par CSV
          </DialogTitle>
          <DialogDescription>
            Importez des produits et leurs variantes à partir d'un fichier CSV.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!isComplete ? (
            <>
              <div className="border rounded-md p-4 bg-gray-50">
                <h3 className="text-sm font-medium mb-2">Format requis pour le CSV:</h3>
                <p className="text-xs text-gray-500 mb-2">
                  Le fichier doit avoir les colonnes suivantes:
                </p>
                <ul className="text-xs text-gray-500 space-y-1 ml-4 list-disc">
                  <li>Pour les produits: name, price, category (obligatoires)</li>
                  <li>Facultatif: description, original_price, subcategory, status, is_customizable</li>
                  <li>Pour les variantes: size, color, hex_color, stock (obligatoires)</li>
                  <li>Facultatif pour variantes: price_adjustment, variant_status</li>
                </ul>
                <p className="text-xs text-gray-500 mt-2">
                  Pour les variantes d'un produit, laissez le premier champ (name) vide.
                </p>
                <div className="mt-3 pt-2 border-t border-gray-200">
                  <a 
                    href="/csv-templates/products-import-template.csv" 
                    download
                    className="text-xs text-teal-600 hover:text-teal-800 flex items-center gap-1"
                  >
                    <FileSpreadsheet className="h-3 w-3" />
                    Télécharger un exemple de fichier CSV
                  </a>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Sélectionner un fichier CSV
                </label>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  disabled={isLoading}
                  className="cursor-pointer"
                />
              </div>

              {file && (
                <div className="bg-teal-50 text-teal-700 rounded p-2 text-sm flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  {file.name}
                </div>
              )}

              {importStatus && (
                <div className="bg-gray-100 rounded-md p-3">
                  <div className="text-sm">Progression de l'importation:</div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>Total: {importStatus.total}</span>
                    <span className="text-green-600">Succès: {importStatus.success}</span>
                    <span className="text-red-600">Échecs: {importStatus.failed}</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-8 flex flex-col items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-medium text-center">Importation terminée</h3>
              <p className="text-gray-500 text-center mt-1">
                {importStatus?.success} produits importés avec succès
                {importStatus?.failed ? `, ${importStatus.failed} échecs` : ''}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          {isComplete ? (
            <Button onClick={handleClose}>Fermer</Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                Annuler
              </Button>
              <Button 
                onClick={importProducts} 
                disabled={!file || isLoading}
                className="bg-teal-600 hover:bg-teal-700"
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
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CSVImportModal;
