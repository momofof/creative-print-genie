
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Upload } from "lucide-react";
import CSVFormatInfo from "./CSVFormatInfo";

interface ImportFormProps {
  file: File | null;
  onFileChange: (file: File) => void;
  onStartImport: () => void;
  onShowInfo: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const ImportForm = ({ file, onFileChange, onStartImport, onShowInfo, fileInputRef }: ImportFormProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div className="flex items-center border rounded-md p-4 bg-gray-50">
        <FileSpreadsheet className="h-8 w-8 text-teal-600 mr-3" />
        <div>
          <p className="text-sm font-medium">Format du fichier CSV</p>
          <p className="text-xs text-gray-500">
            Colonnes: name, price, category, subcategory, status, description, 
            original_price, is_customizable, image, size, color, hex_color, stock, 
            price_adjustment, variant_status
          </p>
          <Button 
            variant="link" 
            className="text-xs p-0 h-auto text-teal-600"
            onClick={onShowInfo}
          >
            Voir un exemple
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Fichier CSV</label>
        <Input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange}
          ref={fileInputRef}
          className="cursor-pointer"
        />
      </div>
      
      {file && (
        <div className="flex items-center text-sm text-gray-500">
          <span className="font-medium mr-1">{file.name}</span>
          ({Math.round(file.size / 1024)} Ko)
        </div>
      )}
      
      <Button
        onClick={onStartImport}
        disabled={!file}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white mt-2"
      >
        <Upload className="h-4 w-4 mr-2" />
        Importer les produits
      </Button>
    </div>
  );
};

export default ImportForm;
