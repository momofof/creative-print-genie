
import OrderForm from "./OrderForm";
import { Product } from "@/types/product";

interface ProductOrderFormProps {
  products: Product[];
}

const ProductOrderForm = ({ products }: ProductOrderFormProps) => {
  return <OrderForm products={products} />;
};

export default ProductOrderForm;
