
import { CartItem } from "@/types/product";
import OrderSuccessDialog from "../../../cart/OrderSuccessDialog";
import { useCart } from "@/hooks/useCart";

interface OrderSummaryHandlerProps {
  showOrderSummary: boolean;
  setShowOrderSummary: (show: boolean) => void;
  orderSummaryItems: CartItem[];
  orderTotal: number;
}

const OrderSummaryHandler = ({
  showOrderSummary,
  setShowOrderSummary,
  orderSummaryItems,
  orderTotal
}: OrderSummaryHandlerProps) => {
  const { editCartItem } = useCart();
  
  return (
    <OrderSuccessDialog
      open={showOrderSummary}
      onOpenChange={setShowOrderSummary}
      cartItems={orderSummaryItems}
      totalPrice={orderTotal}
      editCartItem={editCartItem}
    />
  );
};

export default OrderSummaryHandler;
