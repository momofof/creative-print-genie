
import { MinusCircle, PlusCircle, Trash2, AlertTriangle, Edit2 } from "lucide-react";
import { CartItem as CartItemType } from "@/types/product";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import ProductOrderForm from "../home/ProductOrderForm";
import { useSupplierDashboard } from "@/hooks/useSupplierDashboard";
import { convertDashboardToUIProducts } from "@/utils/productTypeConverter";

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (id: string, newQuantity: number) => void;
  removeItem: (id: string) => void;
  editCartItem: (id: string, newQuantity: number, variants?: Record<string, string>) => void;
}

const CartItem = ({ item, updateQuantity, removeItem, editCartItem }: CartItemProps) => {
  const [open, setOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { products, fetchProducts } = useSupplierDashboard();
  const [loadingProducts, setLoadingProducts] = useState(false);
  
  const handleRemove = () => {
    removeItem(item.id);
    setOpen(false);
  };

  const handleEditCartItem = (productId: string, quantity: number, variants: Record<string, string>) => {
    editCartItem(item.id, quantity, variants);
    setEditModalOpen(false);
  };

  const handleOpenEditModal = async () => {
    // Charger les produits si ce n'est pas déjà fait
    if (products.length === 0) {
      setLoadingProducts(true);
      await fetchProducts();
      setLoadingProducts(false);
    }
    setEditModalOpen(true);
  };

  return (
    <div className="p-4 flex flex-col sm:flex-row gap-4">
      <div className="flex-shrink-0">
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          className="w-24 h-24 object-cover rounded"
        />
      </div>
      <div className="flex-grow">
        <h3 className="font-medium">{item.name}</h3>
        <p className="text-accent font-medium mt-1">
          {item.price.toLocaleString('fr-FR')} €
        </p>
        
        {item.variants && Object.keys(item.variants).length > 0 && (
          <div className="mt-1 text-sm text-gray-500">
            {Object.entries(item.variants).map(([key, value]) => (
              <span key={key} className="mr-3">
                {key}: {value}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center mt-2 space-x-2">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="text-gray-500 hover:text-accent"
            aria-label="Diminuer la quantité"
          >
            <MinusCircle size={20} />
          </button>
          <span className="px-2 py-1 border rounded-md min-w-[40px] text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="text-gray-500 hover:text-accent"
            aria-label="Augmenter la quantité"
          >
            <PlusCircle size={20} />
          </button>
          
          <button
            onClick={handleOpenEditModal}
            className="ml-2 text-blue-600 hover:text-blue-800 flex items-center gap-1"
            aria-label="Modifier les options"
          >
            <Edit2 size={18} />
            <span className="text-sm hidden sm:inline">Modifier</span>
          </button>
          
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <button
                className="ml-auto text-red-600 hover:text-red-800"
                aria-label="Supprimer du panier"
              >
                <Trash2 size={20} />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Confirmer la suppression
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer "{item.name}" de votre panier ?
                  Cette action ne peut pas être annulée.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleRemove}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      {/* Modal d'édition du produit */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Modifier les options du produit</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Vous pouvez modifier la quantité et les options du produit ici.
            </DialogDescription>
          </DialogHeader>
          
          {loadingProducts ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
            </div>
          ) : (
            <ProductOrderForm
              products={convertDashboardToUIProducts(products)}
              editMode={true}
              initialProductId={item.id}
              initialVariants={item.variants}
              initialQuantity={item.quantity}
              onEditComplete={handleEditCartItem}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CartItem;
