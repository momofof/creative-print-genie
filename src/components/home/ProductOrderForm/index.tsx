
import OrderForm from "./OrderForm";
import { Product } from "@/types/product";

interface ProductOrderFormProps {
  products: Product[];
  editMode?: boolean;
  initialProductId?: string;
  initialVariants?: Record<string, string>;
  initialQuantity?: number;
  onEditComplete?: (productId: string, quantity: number, variants: Record<string, string>) => void;
}

const ProductOrderForm = ({ 
  products, 
  editMode = false, 
  initialProductId, 
  initialVariants, 
  initialQuantity,
  onEditComplete 
}: ProductOrderFormProps) => {
  return (
    <OrderForm 
      products={products} 
      editMode={editMode} 
      initialProductId={initialProductId}
      initialVariants={initialVariants}
      initialQuantity={initialQuantity}
      onEditComplete={onEditComplete}
    />
  );
};

export default ProductOrderForm;
