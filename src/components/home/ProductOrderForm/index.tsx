import { allProducts } from "@/data/productData";
import OrderForm from "./OrderForm";

const ProductOrderForm = () => {
  // This component is now a simple wrapper that passes data to the OrderForm component
  // We keep it to maintain the same import path for other files that use it
  return <OrderForm />;
};

export default ProductOrderForm;
