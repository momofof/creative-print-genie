
import { Button } from "@/components/ui/button";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

interface OrderDialogFooterProps {
  editMode: boolean;
  onContinueShopping: () => void;
  onSaveChanges: () => void;
}

const OrderDialogFooter = ({
  editMode,
  onContinueShopping,
  onSaveChanges,
}: OrderDialogFooterProps) => {
  return (
    <>
      {editMode ? (
        <Button
          className="w-full bg-accent hover:bg-accent/90"
          onClick={onSaveChanges}
        >
          Enregistrer les modifications
        </Button>
      ) : (
        <>
          <Button
            variant="outline"
            className="w-full sm:w-auto flex items-center gap-2"
            onClick={onContinueShopping}
          >
            <ShoppingBag size={16} />
            <span>Continuer vos achats</span>
          </Button>
          <Button 
            className="w-full sm:w-auto flex items-center gap-2 bg-accent hover:bg-accent/90"
            asChild
          >
            <Link to="/cart">
              <ShoppingCart size={16} />
              <span>Voir le panier</span>
            </Link>
          </Button>
        </>
      )}
    </>
  );
};

export default OrderDialogFooter;
