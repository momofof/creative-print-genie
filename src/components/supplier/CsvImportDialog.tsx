
import React, { useState } from "react";
import { FileInput, Download } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateProductCsvTemplate, generateVariantCsvTemplate, downloadCsv } from "@/utils/csvHelpers";

interface CsvImportDialogProps {
  onImport: (file: File, type: "products" | "variants") => Promise<void>;
  productId?: string;
}

const CsvImportDialog: React.FC<CsvImportDialogProps> = ({ onImport, productId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [importType, setImportType] = useState<"products" | "variants">("products");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!csvFile) {
      return;
    }

    setIsLoading(true);
    
    try {
      await onImport(csvFile, importType);
      setIsOpen(false);
      setCsvFile(null);
    } catch (error) {
      console.error("Erreur d'importation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadProductTemplate = () => {
    const blob = generateProductCsvTemplate();
    downloadCsv(blob, "product_template.csv");
  };

  const downloadVariantTemplate = () => {
    const blob = generateVariantCsvTemplate();
    downloadCsv(blob, "variant_template.csv");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileInput className="h-4 w-4 mr-2" />
          Importer CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importer depuis un fichier CSV</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="import" className="w-full pt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="import">Importer</TabsTrigger>
            <TabsTrigger value="templates">Modèles</TabsTrigger>
          </TabsList>
          
          <TabsContent value="import" className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type d'importation</label>
              <Select 
                value={importType} 
                onValueChange={(value) => setImportType(value as "products" | "variants")}
                disabled={importType === "variants" && !productId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir le type d'importation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="products">Produits</SelectItem>
                  <SelectItem value="variants" disabled={!productId}>
                    Variantes {!productId && "(Nécessite un produit)"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Fichier CSV</label>
              <Input 
                type="file" 
                accept=".csv" 
                onChange={handleCsvFileChange}
                className="block w-full text-sm"
              />
              <p className="mt-2 text-xs text-gray-500">
                {importType === "products" ? 
                  "Format: name,price,category,subcategory,description,status,etc." :
                  "Format: size,color,hex_color,stock,price_adjustment,status"
                }
              </p>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
              >
                Annuler
              </Button>
              <Button 
                onClick={handleImport} 
                disabled={!csvFile || isLoading}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                {isLoading ? "Importation..." : "Importer"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Modèle de produits</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Téléchargez ce modèle pour importer plusieurs produits à la fois.
                </p>
                <Button onClick={downloadProductTemplate} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger le modèle de produits
                </Button>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Modèle de variantes</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Téléchargez ce modèle pour importer plusieurs variantes pour un produit.
                </p>
                <Button onClick={downloadVariantTemplate} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger le modèle de variantes
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CsvImportDialog;
