
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { useCSVImport } from "./useCSVImport";
import ImportForm from "./ImportForm";
import ImportSuccess from "./ImportSuccess";

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
    importProducts,
    reset
  } = useCSVImport({ onImportSuccess });

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
            <ImportForm 
              file={file}
              isLoading={isLoading}
              importStatus={importStatus}
              onFileChange={handleFileChange}
            />
          ) : (
            <ImportSuccess 
              importStatus={importStatus}
              onClose={handleClose}
            />
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
