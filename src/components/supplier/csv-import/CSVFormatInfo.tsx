
import { FileSpreadsheet } from "lucide-react";

const CSVFormatInfo = () => {
  return (
    <div className="flex items-center border rounded-md p-4 bg-gray-50">
      <FileSpreadsheet className="h-8 w-8 text-teal-600 mr-3" />
      <div>
        <p className="text-sm font-medium">Format du fichier CSV</p>
        <p className="text-xs text-gray-500">
          Colonnes: name, price, category, subcategory, status, description, original_price, is_customizable, size, color, hex_color, stock, price_adjustment, variant_status
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Les données de variantes (size, color, etc.) seront automatiquement converties en format JSON pour la base de données Supabase.
        </p>
      </div>
    </div>
  );
};

export default CSVFormatInfo;
