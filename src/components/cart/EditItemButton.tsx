
import { Edit2 } from "lucide-react";

interface EditItemButtonProps {
  onEdit: () => void;
}

const EditItemButton = ({ onEdit }: EditItemButtonProps) => {
  return (
    <button
      onClick={onEdit}
      className="ml-2 text-blue-600 hover:text-blue-800 flex items-center gap-1"
      aria-label="Modifier les options"
    >
      <Edit2 size={18} />
      <span className="text-sm hidden sm:inline">Modifier</span>
    </button>
  );
};

export default EditItemButton;
