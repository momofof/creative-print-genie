
import { ShoppingBag, ShoppingCart, Check, Edit, MinusCircle, PlusCircle } from "lucide-react";
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
import { useState } from "react";
import { useCart } from "@/hooks/useCart";

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
  const { editCartItem } = useCart();
  const [editMode, setEditMode] = useState(false);
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});
  
  // Initialiser les quantités locales quand les articles changent
  useState(() => {
    const quantities: Record<string, number> = {};
    cartItems.forEach(item => {
      const itemKey = `${item.id}-${JSON.stringify(item.variants || {})}`;
      quantities[itemKey] = item.quantity;
    });
    setItemQuantities(quantities);
  });

  const handleContinueShoppingClick = () => {
    // Fermer le dialogue et naviguer vers la page d'accueil
    onOpenChange(false);
    navigate('/');
  };

  const getItemKey = (item: CartItem) => {
    return `${item.id}-${JSON.stringify(item.variants || {})}`;
  };

  const handleQuantityChange = (item: CartItem, delta: number) => {
    const itemKey = getItemKey(item);
    const currentQuantity = itemQuantities[itemKey] || item.quantity;
    const newQuantity = Math.max(1, currentQuantity + delta);
    
    setItemQuantities(prev => ({
      ...prev,
      [itemKey]: newQuantity
    }));
  };

  const handleSaveChanges = () => {
    // Appliquer les modifications à tous les articles
    cartItems.forEach(item => {
      const itemKey = getItemKey(item);
      const newQuantity = itemQuantities[itemKey];
      
      if (newQuantity && newQuantity !== item.quantity) {
        editCartItem(item.id, newQuantity, item.variants);
      }
    });
    
    setEditMode(false);
    onOpenChange(false); // Fermer la fenêtre après sauvegarde
    navigate('/cart'); // Rediriger vers le panier pour voir les modifications
  };

  // Calculer le total basé sur les quantités modifiées
  const calculateModifiedTotal = () => {
    return cartItems.reduce((sum, item) => {
      const itemKey = getItemKey(item);
      const quantity = itemQuantities[itemKey] || item.quantity;
      return sum + (item.price * quantity);
    }, 0);
  };

  const modifiedTotal = editMode ? calculateModifiedTotal() : totalPrice;

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
        
        <div className="flex justify-end mb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 text-gray-600"
            onClick={() => setEditMode(!editMode)}
          >
            <Edit size={16} />
            <span>{editMode ? "Annuler" : "Modifier"}</span>
          </Button>
        </div>
        
        <div className="max-h-60 overflow-y-auto py-2">
          <div className="space-y-4">
            {cartItems.map((item) => {
              const itemKey = getItemKey(item);
              const quantity = editMode 
                ? (itemQuantities[itemKey] || item.quantity) 
                : item.quantity;
              
              return (
                <div key={itemKey} className="flex items-start gap-3">
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img 
                      src={item.image || "/placeholder.svg"} 
                      alt={item.name}
                      className="h-full w-full object-cover object-center" 
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    
                    {item.variants && Object.keys(item.variants).length > 0 && (
                      <div className="mt-1 text-xs text-gray-500">
                        {Object.entries(item.variants).map(([key, value]) => (
                          <span key={key} className="mr-2">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex justify-between mt-1">
                      {editMode ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item, -1)}
                            className="text-gray-500 hover:text-accent"
                          >
                            <MinusCircle size={16} />
                          </button>
                          <span className="px-2 py-0.5 border rounded-md min-w-[30px] text-center text-sm">
                            {quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item, 1)}
                            className="text-gray-500 hover:text-accent"
                          >
                            <PlusCircle size={16} />
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          Quantité: {quantity}
                        </p>
                      )}
                      <p className="text-sm font-medium">
                        {(item.price * quantity).toLocaleString('fr-FR')} €
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="mt-2 border-t pt-4">
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{modifiedTotal.toLocaleString('fr-FR')} €</span>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
          {editMode ? (
            <Button
              className="w-full bg-accent hover:bg-accent/90"
              onClick={handleSaveChanges}
            >
              Enregistrer les modifications
            </Button>
          ) : (
            <>
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
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderSuccessDialog;
