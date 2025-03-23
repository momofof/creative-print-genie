
import { Product } from "@/types/product";

// Define feature illustrations for each product category
const featureIllustrations: Record<string, string> = {
  "vêtements": "/illustrations/t-shirt.png",
  "t-shirts": "/illustrations/t-shirt.png",
  "hoodies": "/illustrations/hoodie.png",
  "mugs": "/illustrations/mug.png",
  "posters": "/illustrations/poster.png",
  "stickers": "/illustrations/sticker.png",
  "accessoires": "/illustrations/accessory.png",
  "casquettes": "/illustrations/cap.png",
};

// Define variant illustrations for each product category and variant type
const variantIllustrations: Record<string, Record<string, Record<string, string>>> = {
  "vêtements": {
    "color": {
      "red": "/illustrations/t-shirt-red.png",
      "blue": "/illustrations/t-shirt-blue.png",
      "green": "/illustrations/t-shirt-green.png",
      "black": "/illustrations/t-shirt-black.png",
      "white": "/illustrations/t-shirt-white.png",
      "Noir": "/illustrations/t-shirt-black.png",
      "Blanc": "/illustrations/t-shirt-white.png",
      "Bleu": "/illustrations/t-shirt-blue.png",
      "Rouge": "/illustrations/t-shirt-red.png",
      "Vert": "/illustrations/t-shirt-green.png",
    },
  },
  "t-shirts": {
    "color": {
      "red": "/illustrations/t-shirt-red.png",
      "blue": "/illustrations/t-shirt-blue.png",
      "green": "/illustrations/t-shirt-green.png",
      "black": "/illustrations/t-shirt-black.png",
      "white": "/illustrations/t-shirt-white.png",
      "Noir": "/illustrations/t-shirt-black.png",
      "Blanc": "/illustrations/t-shirt-white.png",
      "Bleu": "/illustrations/t-shirt-blue.png",
      "Rouge": "/illustrations/t-shirt-red.png",
      "Vert": "/illustrations/t-shirt-green.png",
    },
  },
  "hoodies": {
    "color": {
      "red": "/illustrations/hoodie-red.png",
      "blue": "/illustrations/hoodie-blue.png",
      "green": "/illustrations/hoodie-green.png",
      "black": "/illustrations/hoodie-black.png",
      "white": "/illustrations/hoodie-white.png",
      "Noir": "/illustrations/hoodie-black.png",
      "Blanc": "/illustrations/hoodie-white.png",
      "Bleu": "/illustrations/hoodie-blue.png",
      "Rouge": "/illustrations/hoodie-red.png",
      "Vert": "/illustrations/hoodie-green.png",
    },
  },
  "mugs": {
    "color": {
      "white": "/illustrations/mug-white.png",
      "black": "/illustrations/mug-black.png",
      "blue": "/illustrations/mug-blue.png",
      "green": "/illustrations/mug-green.png",
      "Blanc": "/illustrations/mug-white.png",
      "Noir": "/illustrations/mug-black.png",
      "Bleu": "/illustrations/mug-blue.png",
      "Vert": "/illustrations/mug-green.png",
    },
  },
  "accessoires": {
    "color": {
      "black": "/illustrations/accessory-black.png",
      "white": "/illustrations/accessory-white.png",
      "blue": "/illustrations/accessory-blue.png",
      "red": "/illustrations/accessory-red.png",
      "green": "/illustrations/accessory-green.png",
      "Noir": "/illustrations/accessory-black.png",
      "Blanc": "/illustrations/accessory-white.png",
      "Bleu": "/illustrations/accessory-blue.png",
      "Rouge": "/illustrations/accessory-red.png",
      "Vert": "/illustrations/accessory-green.png",
    },
  },
  "casquettes": {
    "color": {
      "black": "/illustrations/cap-black.png",
      "white": "/illustrations/cap-white.png",
      "blue": "/illustrations/cap-blue.png",
      "red": "/illustrations/cap-red.png",
      "green": "/illustrations/cap-green.png",
      "Noir": "/illustrations/cap-black.png",
      "Blanc": "/illustrations/cap-white.png",
      "Bleu": "/illustrations/cap-blue.png",
      "Rouge": "/illustrations/cap-red.png",
      "Vert": "/illustrations/cap-green.png",
    },
  },
};

// Find variant image in the product's variant_images
const findVariantImage = (product: Product, variantType: string, variantValue: string): string | null => {
  if (!product.variants || !product.variant_images) {
    return null;
  }
  
  // Try to find the matching variant
  const matchingVariant = (product.variants as any[]).find(v => 
    (variantType === 'color' && v.color === variantValue) || 
    (variantType === 'size' && v.size === variantValue)
  );
  
  if (matchingVariant && matchingVariant.id && product.variant_images[matchingVariant.id]) {
    // Get the first image from the variant images array
    const images = product.variant_images[matchingVariant.id];
    return Array.isArray(images) && images.length > 0 ? images[0] : null;
  }
  
  return null;
};

// Function to get feature illustration for a product category
export const getFeatureIllustration = (product: Product | undefined, variants: Record<string, string>): string => {
  if (!product) return "/placeholder.svg";
  
  // If the product has its own image, use it first
  if (product.image) {
    return product.image;
  }
  
  // Si le produit a une subcategory, essayer d'abord avec celle-ci
  const category = product.subcategory || product.category;
  
  // If there are variants selected, try to find a variant-specific image
  if (Object.keys(variants).length > 0) {
    if (variants.color && product.variant_images) {
      // Try to find a specific variant image
      const variantImage = findVariantImage(product, 'color', variants.color);
      if (variantImage) {
        return variantImage;
      }
      
      // Vérifier d'abord avec la subcategory
      if (variantIllustrations[category]?.color?.[variants.color]) {
        return variantIllustrations[category].color[variants.color];
      }
      // Si pas trouvé, essayer avec la category principale
      if (variantIllustrations[product.category]?.color?.[variants.color]) {
        return variantIllustrations[product.category].color[variants.color];
      }
    }
  }
  
  // Si pas d'illustration spécifique trouvée, renvoyer l'illustration générique
  return featureIllustrations[category] || 
         featureIllustrations[product.category] || 
         "/placeholder.svg";
};

// Function to get variant illustration for a product category and variant type
export const getVariantIllustration = (productCategory: string, variantType: string, value: string): string => {
  // Vérifier d'abord la catégorie exacte
  const illustration = variantIllustrations[productCategory]?.[variantType]?.[value];
  if (illustration) return illustration;
  
  // Si pas trouvé, vérifier la catégorie en minuscules
  const lowerCaseIllustration = variantIllustrations[productCategory.toLowerCase()]?.[variantType]?.[value];
  if (lowerCaseIllustration) return lowerCaseIllustration;
  
  // Si toujours pas trouvé, renvoyer l'illustration générique
  return featureIllustrations[productCategory] || 
         featureIllustrations[productCategory.toLowerCase()] || 
         "/placeholder.svg";
};
