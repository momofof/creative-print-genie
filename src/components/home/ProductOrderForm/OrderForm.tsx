
import { Product } from "@/types/product";
import OrderFormContainer from "./OrderFormContainer";

interface OrderFormProps {
  products: Product[];
  editMode?: boolean;
  initialProductId?: string;
  initialVariants?: Record<string, string>;
  initialQuantity?: number;
  onEditComplete?: (productId: string, quantity: number, variants: Record<string, string>) => void;
}

const OrderForm = ({ 
  products, 
  editMode = false, 
  initialProductId, 
  initialVariants = {}, 
  initialQuantity,
  onEditComplete 
}: OrderFormProps) => {
  return (
    <OrderFormContainer
      products={products}
      editMode={editMode}
      initialProductId={initialProductId}
      initialVariants={initialVariants}
      initialQuantity={initialQuantity}
      onEditComplete={onEditComplete}
    />
  );
};

export default OrderForm;
