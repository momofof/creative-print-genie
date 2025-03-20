import { useState, useEffect } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { useCart } from "@/hooks/useCart";
import CartItem from "@/components/cart/CartItem";
import OrderSuccessDialog from "@/components/cart/OrderSuccessDialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Cart = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    isLoading, 
    totalPrice, 
    updateQuantity, 
    removeItem, 
    clearCart,
    editCartItem 
  } = useCart();
  const [clearCartDialogOpen, setClearCartDialogOpen] = useState(false);
  const [orderSuccessDialogOpen, setOrderSuccessDialogOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [selectAll, setSelectAll] = useState(false);
  
  const handleClearCart = () => {
    clearCart();
    setClearCartDialogOpen(false);
    setSelectedItems({});
  };

  const handleCheckout = () => {
    const isAuthenticated = Boolean(localStorage.getItem("supabase.auth.token"));
    
    if (!isAuthenticated) {
      toast.info("Veuillez vous connecter pour passer une commande");
      navigate("/login");
      return;
    }
    
    setOrderSuccessDialogOpen(true);
    toast.success("Votre commande a été traitée avec succès!");
  };
  
  const handleSelectItem = (id: string, isSelected: boolean) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: isSelected
    }));
  };
  
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    const newSelectedItems: Record<string, boolean> = {};
    
    if (checked) {
      cartItems.forEach(item => {
        newSelectedItems[item.id] = true;
      });
    }
    
    setSelectedItems(newSelectedItems);
  };
  
  const handleDeleteSelected = () => {
    const itemsToDelete = Object.entries(selectedItems)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);
    
    if (itemsToDelete.length === 0) {
      toast.error("Veuillez sélectionner au moins un article à supprimer");
      return;
    }
    
    itemsToDelete.forEach(id => removeItem(id));
    setSelectedItems({});
    toast.success(`${itemsToDelete.length} article(s) supprimé(s) du panier`);
  };
  
  useEffect(() => {
    if (cartItems.length === 0) {
      setSelectAll(false);
      setSelectedItems({});
      return;
    }
    
    const allSelected = cartItems.every(item => selectedItems[item.id]);
    setSelectAll(allSelected);
  }, [cartItems, selectedItems]);

  return (
    <>
      <Navigation />
      <main className="container mx-auto px-4 py-24 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Votre Panier</h1>
        
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-medium mb-4">Votre panier est vide</h2>
            <p className="text-gray-600 mb-8">Parcourez notre catalogue pour trouver des produits à ajouter à votre panier</p>
            <Link to="/" className="bg-accent text-white px-6 py-3 rounded-md font-medium hover:bg-accent/90 inline-block">
              Voir le catalogue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="select-all"
                        checked={selectAll} 
                        onCheckedChange={(checked) => handleSelectAll(!!checked)} 
                      />
                      <label htmlFor="select-all" className="text-sm cursor-pointer">
                        Tout sélectionner
                      </label>
                      <h2 className="text-lg font-medium ml-2">Articles ({cartItems.length})</h2>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeleteSelected}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        disabled={Object.values(selectedItems).every(selected => !selected)}
                      >
                        <Trash2 size={16} className="mr-1" />
                        Supprimer sélection
                      </Button>
                      
                      <AlertDialog open={clearCartDialogOpen} onOpenChange={setClearCartDialogOpen}>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} className="mr-1" />
                            <span>Vider le panier</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5 text-red-500" />
                              Vider le panier
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir vider votre panier ? Tous les articles seront supprimés.
                              Cette action ne peut pas être annulée.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={handleClearCart}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              Vider le panier
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
                
                <div className="divide-y">
                  {cartItems.map((item) => (
                    <CartItem 
                      key={item.id}
                      item={item}
                      isSelected={!!selectedItems[item.id]}
                      onSelectionChange={handleSelectItem}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4 sticky top-24">
                <h2 className="text-lg font-medium mb-4">Récapitulatif</h2>
                
                <div className="space-y-2">
                  <div className="flex justify-between pb-2">
                    <span>Sous-total</span>
                    <span>{totalPrice.toLocaleString('fr-FR')} €</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span>Livraison</span>
                    <span>Calculé à l'étape suivante</span>
                  </div>
                  <div className="border-t pt-2 font-medium text-lg flex justify-between">
                    <span>Total</span>
                    <span>{totalPrice.toLocaleString('fr-FR')} €</span>
                  </div>
                </div>
                
                <button
                  className="w-full bg-accent text-white py-3 rounded-md font-medium mt-6 hover:bg-accent/90"
                  onClick={handleCheckout}
                >
                  Passer à la caisse
                </button>
                
                <Link
                  to="/"
                  className="w-full block text-center border border-gray-300 text-gray-700 py-3 rounded-md font-medium mt-3 hover:bg-gray-50"
                >
                  Continuer vos achats
                </Link>
              </div>
            </div>
          </div>
        )}
        
        <OrderSuccessDialog
          open={orderSuccessDialogOpen}
          onOpenChange={setOrderSuccessDialogOpen}
          cartItems={cartItems}
          totalPrice={totalPrice}
        />
      </main>
    </>
  );
};

export default Cart;
