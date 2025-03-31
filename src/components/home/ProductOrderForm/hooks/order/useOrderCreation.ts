
import { Product } from "@/types/product";
import { OrderItem, orderService } from "@/services/orderService";

interface OrderParams {
  product: Product;
  quantity: number;
  variants: Record<string, string>;
  supplierId: string;
  userId: string | null;
}

interface OrderResult {
  success: boolean;
  orderId?: string;
  message?: string;
}

export const useOrderCreation = () => {
  const createOrder = async ({
    product,
    quantity,
    variants,
    supplierId,
    userId
  }: OrderParams): Promise<OrderResult> => {
    try {
      // Create order item from selected product
      const orderItem: OrderItem = {
        product_id: product.id,
        product_name: product.name,
        quantity: quantity,
        price: product.price,
        variants: Object.keys(variants).length > 0 ? variants : {}
      };
      
      // Calculate total price
      const totalPrice = orderItem.price * orderItem.quantity;
      
      console.log("Creating order with:", {
        items: [orderItem],
        total: totalPrice,
        supplier_id: supplierId
      });
      
      // Create the order with supplier information in shipping_address
      const result = await orderService.createOrder({
        customer_id: userId || undefined,
        items: [orderItem],
        total: totalPrice,
        status: 'pending',
        shipping_address: {
          name: "",
          address: "",
          city: "",
          postal_code: "",
          country: "",
          supplier_id: supplierId
        }
      });
      
      console.log("Order creation result:", result);
      
      return result;
    } catch (error) {
      console.error("Error creating order:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error"
      };
    }
  };

  return { createOrder };
};
