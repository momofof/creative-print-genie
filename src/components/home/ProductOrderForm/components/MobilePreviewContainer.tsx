
import { Product } from "@/types/product";
import MobilePreview from "./MobilePreview";

interface MobilePreviewContainerProps {
  selectedProduct: Product | undefined;
  variants: Record<string, string>;
  onShowPreview: () => void;
}

const MobilePreviewContainer = ({
  selectedProduct,
  variants,
  onShowPreview
}: MobilePreviewContainerProps) => {
  if (!selectedProduct || Object.keys(variants).length === 0) {
    return null;
  }

  return (
    <>
      <div className="mb-6">
        <MobilePreview selectedProduct={selectedProduct} variants={variants} />
      </div>
      <div className="md:hidden">
        <button
          className="w-full mt-4 py-2.5 px-4 border border-gray-300 rounded-md bg-gray-50 text-gray-700 font-medium flex items-center justify-center"
          onClick={onShowPreview}
        >
          <span>Voir l'aperçu du produit</span>
        </button>
      </div>
    </>
  );
};

export default MobilePreviewContainer;
