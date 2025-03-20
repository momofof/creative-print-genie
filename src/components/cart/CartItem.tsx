
import { MinusCircle, PlusCircle, Trash2, AlertTriangle, Edit } from "lucide-react";
import { CartItem as CartItemType } from "@/types/product";
import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ProductOrderForm from "@/components/home/ProductOrderForm";
import { useProducts } from "@/hooks/useProducts";

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (id: string, newQuantity: number) => void;
  removeItem: (id: string) => void;
  editCartItem: (id: string, newQuantity: number, variants?: Record<string, string>) => void;
  isSelected: boolean;
  onSelectChange: (id: string, isSelected: boolean) => void;
}

const CartItem = ({ 
  item, 
  updateQuantity, 
  removeItem, 
  editCartItem,
  isSelected,
  onSelectChange
}: CartItemProps) => {
  const [open, setOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { products } = useProducts();
  
  const handleRemove = () => {
    removeItem(item.id);
    setOpen(false);
  };

  const productToEdit = products.find(product => product.id === item.id);

  return (
    <div className="p-4 flex flex-col sm:flex-row gap-4">
      <div className="flex items-center">
        <Checkbox 
          id={`select-${item.id}`}
          checked={isSelected} 
          onCheckedChange={(checked) => onSelectChange(item.id, !!checked)}
          className="mr-3"
        />
      </div>
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
            onClick={() => setEditDialogOpen(true)}
            className="ml-2 text-blue-600 hover:text-blue-800"
            aria-label="Modifier"
          >
            <Edit size={20} />
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
      
      {/* Edit dialog */}
      {productToEdit && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Modifier {item.name}</DialogTitle>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-y-auto py-4">
              <ProductOrderForm 
                initialProduct={productToEdit} 
                initialQuantity={item.quantity}
                initialVariants={item.variants}
                onEditComplete={(updatedQuantity, updatedVariants) => {
                  editCartItem(item.id, updatedQuantity, updatedVariants);
                  setEditDialogOpen(false);
                }}
                isEditMode={true}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CartItem;
