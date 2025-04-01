
import { getVariantDisplayName } from "@/components/home/ProductOrderForm/utils/variantDisplay";

interface CartItemVariantsProps {
  variants?: Record<string, string>;
}

const CartItemVariants = ({ variants }: CartItemVariantsProps) => {
  if (!variants || Object.keys(variants).length === 0) return null;
  
  return (
    <div className="mt-1 text-sm text-gray-500">
      {Object.entries(variants).map(([key, value]) => (
        <span key={key} className="mr-3">
          {getVariantDisplayName(key, value)}
        </span>
      ))}
    </div>
  );
};

export default CartItemVariants;
