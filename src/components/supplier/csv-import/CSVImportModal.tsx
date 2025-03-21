
import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCSVImport } from "./useCSVImport";
import ImportForm from "./csv-import/ImportForm";
import ImportProgress from "./csv-import/ImportProgress";
import ImportSuccess from "./csv-import/ImportSuccess";
import CSVFormatInfo from "./csv-import/CSVFormatInfo";
import { getNextProductId } from "@/pages/supplier/hooks/utils/productFormUtils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CSVImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSuccess: () => void;
}

const CSVImportModal = ({ open, onOpenChange, onImportSuccess }: CSVImportModalProps) => {
  const {
    file,
    isLoading,
    importStatus,
    isComplete,
    handleFileChange,
    reset
  } = useCSVImport({ onImportSuccess });
  
  const [activeStep, setActiveStep] = useState<'upload' | 'progress' | 'success' | 'info'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartImport = async () => {
    setActiveStep('progress');
    
    try {
      if (!file) {
        toast.error("Veuillez sélectionner un fichier CSV");
        setActiveStep('upload');
        return;
      }
      
      // Get user info
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        toast.error("Utilisateur non authentifié");
        return;
      }
      
      // Parse the CSV file
      const text = await file.text();
      const csvLines = text.split('\n');
      const headers = csvLines[0].split(',').map(header => header.trim());
      
      // Simple validation for required headers
      const requiredHeaders = ['name', 'price', 'category'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        toast.error(`En-têtes manquantes: ${missingHeaders.join(', ')}`);
        setActiveStep('upload');
        return;
      }
      
      // Process the CSV data
      const productRows = [];
      let currentProduct = null;
      
      for (let i = 1; i < csvLines.length; i++) {
        const line = csvLines[i].trim();
        if (!line) continue;
        
        const values = line.split(',').map(val => val.trim());
        
        // If the first column is not empty, this is a new product
        if (values[0]) {
          if (currentProduct) {
            productRows.push(currentProduct);
          }
          
          currentProduct = {
            name: values[headers.indexOf('name')],
            price: parseFloat(values[headers.indexOf('price')]),
            category: values[headers.indexOf('category')],
            variants: [],
            // Get optional fields
            subcategory: headers.includes('subcategory') ? values[headers.indexOf('subcategory')] : null,
            description: headers.includes('description') ? values[headers.indexOf('description')] : null,
            original_price: headers.includes('original_price') ? parseFloat(values[headers.indexOf('original_price')]) : null,
            status: headers.includes('status') ? (values[headers.indexOf('status')] as 'draft' | 'published' | 'archived') : 'draft',
            is_customizable: headers.includes('is_customizable') ? values[headers.indexOf('is_customizable')].toLowerCase() === 'true' : false,
            image: headers.includes('image') ? values[headers.indexOf('image')] : null,
            supplier_id: userData.user.id
          };
        } else if (currentProduct && values[headers.indexOf('size')]) {
          // This is a variant line
          currentProduct.variants.push({
            id: crypto.randomUUID(),
            size: values[headers.indexOf('size')],
            color: values[headers.indexOf('color')],
            hex_color: values[headers.indexOf('hex_color')],
            stock: parseInt(values[headers.indexOf('stock')], 10) || 0,
            price_adjustment: headers.includes('price_adjustment') ? parseFloat(values[headers.indexOf('price_adjustment')]) : 0,
            status: headers.includes('variant_status') ? (values[headers.indexOf('variant_status')] as 'in_stock' | 'low_stock' | 'out_of_stock') : 'in_stock'
          });
        }
      }
      
      // Add the last product
      if (currentProduct) {
        productRows.push(currentProduct);
      }
      
      // Get the next sequential ID
      const nextId = await getNextProductId();
      
      // Insert products into the database
      let successCount = 0;
      let failCount = 0;
      let currentId = nextId;
      
      for (const product of productRows) {
        try {
          const { error } = await supabase
            .from('products_master')
            .insert({
              ...product,
              id: currentId.toString()
            });
          
          if (error) throw error;
          
          successCount++;
          currentId++;
        } catch (error) {
          console.error(`Error importing product ${product.name}:`, error);
          failCount++;
        }
      }
      
      // Show completion message
      if (successCount > 0) {
        toast.success(`${successCount} produits importés avec succès`);
        if (failCount > 0) {
          toast.error(`${failCount} produits n'ont pas pu être importés`);
        }
        setActiveStep('success');
        onImportSuccess();
      } else {
        toast.error("Aucun produit n'a pu être importé");
        setActiveStep('upload');
      }
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Une erreur s'est produite lors de l'importation");
      setActiveStep('upload');
    }
  };
  
  const handleReset = () => {
    reset();
    setActiveStep('upload');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleClose = () => {
    if (!isLoading) {
      handleReset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Importer des produits</DialogTitle>
          <DialogDescription>
            Importez vos produits en masse à partir d'un fichier CSV.
          </DialogDescription>
        </DialogHeader>

        {activeStep === 'upload' && (
          <ImportForm 
            file={file} 
            onFileChange={handleFileChange} 
            onStartImport={handleStartImport} 
            onShowInfo={() => setActiveStep('info')}
            fileInputRef={fileInputRef}
          />
        )}

        {activeStep === 'progress' && (
          <ImportProgress 
            isLoading={isLoading}
            importStatus={importStatus}
          />
        )}

        {activeStep === 'success' && (
          <ImportSuccess 
            importStatus={importStatus}
            onReset={handleReset}
            onClose={handleClose}
          />
        )}

        {activeStep === 'info' && (
          <CSVFormatInfo 
            onBack={() => setActiveStep('upload')} 
          />
        )}

        {activeStep === 'upload' && (
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleClose}
            >
              Annuler
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CSVImportModal;
