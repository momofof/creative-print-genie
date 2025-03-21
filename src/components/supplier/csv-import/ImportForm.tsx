
import { useState } from "react";
import { Input } from "@/components/ui/input";
import CSVFormatInfo from "./CSVFormatInfo";
import ImportProgress from "./ImportProgress";

interface ImportFormProps {
  file: File | null;
  isLoading: boolean;
  importStatus: {
    total: number;
    success: number;
    failed: number;
  } | null;
  onFileChange: (file: File) => void;
}

const ImportForm = ({ file, isLoading, importStatus, onFileChange }: ImportFormProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <>
      <CSVFormatInfo />
      
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
      
      {importStatus && <ImportProgress importStatus={importStatus} />}
    </>
  );
};

export default ImportForm;
