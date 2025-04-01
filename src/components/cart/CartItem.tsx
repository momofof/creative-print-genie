
import { useState } from "react";
import { CartItem as CartItemType } from "@/types/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ProductOrderForm from "../home/ProductOrderForm";
import { useSupplierDashboard } from "@/hooks/useSupplierDashboard";
import { convertDashboardToUIProducts } from "@/utils/productTypeConverter";
import CartItemVariants from "./CartItemVariants";
import CartItemQuantity from "./CartItemQuantity";
import RemoveItemDialog from "./RemoveItemDialog";
import EditItemButton from "./EditItemButton";

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (id: string, newQuantity: number) => void;
  removeItem: (id: string) => void;
  editCartItem: (id: string, newQuantity: number, variants?: Record<string, string>) => void;
}

const CartItem = ({ item, updateQuantity, removeItem, editCartItem }: CartItemProps) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { products, fetchProducts } = useSupplierDashboard();
  const [loadingProducts, setLoadingProducts] = useState(false);
  
  const handleRemove = () => {
    removeItem(item.id);
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
        
        <CartItemVariants variants={item.variants} />
        
        <div className="flex items-center mt-2 space-x-2">
          <CartItemQuantity 
            id={item.id}
            quantity={item.quantity}
            updateQuantity={updateQuantity}
          />
          
          <EditItemButton onEdit={handleOpenEditModal} />
          
          <div className="ml-auto">
            <RemoveItemDialog 
              itemName={item.name}
              onRemove={handleRemove}
            />
          </div>
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
