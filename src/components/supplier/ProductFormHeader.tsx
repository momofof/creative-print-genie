
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Save, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CsvImportDialog from "./CsvImportDialog";

interface ProductFormHeaderProps {
  isEditing: boolean;
  isSaving: boolean;
  productId?: string;
  onImport: (file: File, type: "products" | "variants") => Promise<void>;
  onSubmit: () => void;
}

const ProductFormHeader: React.FC<ProductFormHeaderProps> = ({
  isEditing,
  isSaving,
  productId,
  onImport,
  onSubmit
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/supplier/dashboard')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour
          </Button>
          <h1 className="text-xl font-semibold text-gray-900 flex items-center">
            <Store className="h-5 w-5 mr-2 text-teal-600" />
            {isEditing ? "Modifier le produit" : "Ajouter un produit"}
          </h1>
        </div>
        <div className="flex space-x-2">
          <CsvImportDialog 
            onImport={onImport}
            productId={productId}
          />
          
          <Button
            onClick={onSubmit}
            disabled={isSaving}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            {isSaving ? (
              <span className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Enregistrement...
              </span>
            ) : (
              <span className="flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductFormHeader;
