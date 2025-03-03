
import React from "react";
import CustomizationCard from "./CustomizationCard";
import { Customization } from "@/types/dashboard";

interface CustomizationListProps {
  customizations: Customization[];
  onDelete: (id: string) => void;
  onEdit: (customization: Customization) => void;
}

const CustomizationList: React.FC<CustomizationListProps> = ({
  customizations,
  onDelete,
  onEdit
}) => {
  if (customizations.length === 0) {
    return (
      <div className="col-span-full text-center text-gray-500 py-8">
        Aucune option de personnalisation ajoutée.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {customizations.map((customization) => (
        <CustomizationCard
          key={customization.id}
          customization={customization}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default CustomizationList;
