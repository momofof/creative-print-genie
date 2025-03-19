
import { ShoppingBag, ShoppingCart, Check } from "lucide-react";
import { CartItem } from "@/types/product";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface OrderSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: CartItem[];
  totalPrice: number;
}

const OrderSuccessDialog = ({
  open,
  onOpenChange,
  cartItems,
  totalPrice,
}: OrderSuccessDialogProps) => {
  const navigate = useNavigate();
  
  const handleContinueShoppingClick = () => {
    // Fermer le dialogue et naviguer vers la page d'accueil
    onOpenChange(false);
    navigate('/');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-center text-xl">Commande effectuée avec succès</DialogTitle>
          <DialogDescription className="text-center">
            Merci pour votre commande ! Voici un récapitulatif de vos articles.
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-60 overflow-y-auto py-2">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img 
                    src={item.image || "/placeholder.svg"} 
                    alt={item.name}
                    className="h-full w-full object-cover object-center" 
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <div className="flex justify-between mt-1">
                    <p className="text-sm text-gray-500">
                      Quantité: {item.quantity}
                    </p>
                    <p className="text-sm font-medium">
                      {(item.price * item.quantity).toLocaleString('fr-FR')} €
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-2 border-t pt-4">
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{totalPrice.toLocaleString('fr-FR')} €</span>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
          <Button
            variant="outline"
            className="w-full sm:w-auto flex items-center gap-2"
            onClick={handleContinueShoppingClick}
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
              <span>Passer à la caisse</span>
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderSuccessDialog;
