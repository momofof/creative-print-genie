
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartItemEditButtonProps {
  onEdit: () => void;
}

const CartItemEditButton = ({ onEdit }: CartItemEditButtonProps) => {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={onEdit}
      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 h-8"
    >
      <Edit className="h-4 w-4 mr-1" />
      <span className="hidden sm:inline text-xs">Modifier le produit</span>
    </Button>
  );
};

export default CartItemEditButton;
