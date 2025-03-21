
import { Product } from "@/types/product";
import { Image } from "lucide-react";
import { getFeatureIllustration, getVariantIllustration } from "../utils";

interface ProductPreviewImageProps {
  selectedProduct?: Product;
  variants: Record<string, string>;
  activeVariant: { type: string, value: string } | null;
  className?: string;
}

const ProductPreviewImage = ({
  selectedProduct,
  variants,
  activeVariant,
  className = "max-w-full max-h-52 md:max-h-64 object-contain"
}: ProductPreviewImageProps) => {
  // Function to get the currently displayed illustration
  const getCurrentIllustration = () => {
    if (activeVariant && selectedProduct) {
      return getVariantIllustration(
        selectedProduct.subcategory || selectedProduct.category, 
        activeVariant.type, 
        activeVariant.value
      );
    }
    return getFeatureIllustration(selectedProduct, variants);
  };

  if (!selectedProduct) {
    return (
      <div className="text-center p-4">
        <Image className="mx-auto h-12 w-12 text-gray-400 mb-2" />
        <p className="text-gray-500">Sélectionnez un produit et ses options pour visualiser l'aperçu</p>
      </div>
    );
  }

  return (
    <img 
      src={activeVariant ? getCurrentIllustration() : getFeatureIllustration(selectedProduct, variants)} 
      alt="Option aperçu" 
      className={className} 
    />
  );
};

export default ProductPreviewImage;
