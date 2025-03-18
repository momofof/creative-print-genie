
export interface ProductWithVariants {
  id: string;
  name: string;
  price: number;
  category: string;
  subcategory: string;
  image: string;
}

export interface VariantProps {
  type?: string;
  value?: string;
}

export interface IllustrationProps {
  selectedProduct?: ProductWithVariants;
  variants: Record<string, string>;
  openIllustration: boolean;
  setOpenIllustration: (open: boolean) => void;
  activeVariantType?: string;
  activeVariantValue?: string;
}
