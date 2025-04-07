
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CartItem, Product } from "@/types/product";
import ProductOrderForm from "../home/ProductOrderForm";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EditItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: CartItem | null;
  products: Product[];
  loadingProducts: boolean;
  onEditComplete: (productId: string, quantity: number, variants: Record<string, string>) => void;
}

const EditItemModal = ({
  open,
  onOpenChange,
  editingItem,
  products,
  loadingProducts,
  onEditComplete,
}: EditItemModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Modifier les options du produit</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Vous pouvez modifier la quantité et les options du produit ici.
          </DialogDescription>
        </DialogHeader>
        
        {loadingProducts ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : editingItem ? (
          <ScrollArea className="flex-grow overflow-y-auto pr-4">
            <ProductOrderForm
              products={products}
              editMode={true}
              initialProductId={editingItem.id}
              initialVariants={editingItem.variants}
              initialQuantity={editingItem.quantity}
              onEditComplete={onEditComplete}
            />
          </ScrollArea>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default EditItemModal;
