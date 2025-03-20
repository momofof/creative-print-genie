
import { CartItem } from "@/types/product";
import OrderSuccessDialog from "../../../cart/OrderSuccessDialog";

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
  return (
    <OrderSuccessDialog
      open={showOrderSummary}
      onOpenChange={setShowOrderSummary}
      cartItems={orderSummaryItems}
      totalPrice={orderTotal}
    />
  );
};

export default OrderSummaryHandler;
