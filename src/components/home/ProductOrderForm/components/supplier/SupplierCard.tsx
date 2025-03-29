
import { Check, Truck } from "lucide-react";
import { Supplier } from "@/components/home/supplier/types";

interface SupplierCardProps {
  supplier: Supplier;
  isSelected: boolean;
  onSelect: (supplierId: string) => void;
}

const SupplierCard = ({ supplier, isSelected, onSelect }: SupplierCardProps) => {
  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={() => onSelect(supplier.id)}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-400"
          }`}>
            {isSelected ? (
              <Check className="w-5 h-5" />
            ) : (
              <Truck className="w-5 h-5" />
            )}
          </div>
        </div>
        
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{supplier.company_name}</h4>
          {supplier.address && (
            <p className="text-sm text-gray-500 mt-1">{supplier.address}</p>
          )}
          <div className="mt-2 flex items-center text-sm">
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
              isSelected ? "bg-green-500" : "bg-gray-300"
            }`}></span>
            <span className="text-gray-500">Disponible</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierCard;
