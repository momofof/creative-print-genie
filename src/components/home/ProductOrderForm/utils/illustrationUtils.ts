import { Product } from "@/types/product";
import { getPlaceholderImage } from "./variantDisplay";

// Define default illustrations for each product category
const defaultIllustrations: Record<string, string> = {
  "vêtements": "/illustrations/clothing.png",
  "t-shirts": "/illustrations/tshirt.png",
  "hoodies": "/illustrations/hoodie.png",
  "mugs": "/illustrations/mug.png",
  "posters": "/illustrations/poster.png",
  "stickers": "/illustrations/sticker.png",
  "accessoires": "/illustrations/accessory.png",
  "casquettes": "/illustrations/cap.png",
  "velo": "/placeholder.svg",
  "maison": "/illustrations/mug.png",  // Utiliser l'illustration du mug pour la catégorie "maison"
};

// Define variant illustrations for each product category and variant type
const variantIllustrations: Record<string, Record<string, Record<string, string>>> = {
  "vêtements": {
    "color": {
      "red": "/illustrations/clothing-red.png",
      "blue": "/illustrations/clothing-blue.png",
      "green": "/illustrations/clothing-green.png",
      "black": "/illustrations/clothing-black.png",
      "white": "/illustrations/clothing-white.png",
      "Noir": "/illustrations/clothing-black.png",
      "Blanc": "/illustrations/clothing-white.png",
      "Bleu": "/illustrations/clothing-blue.png",
      "Rouge": "/illustrations/clothing-red.png",
      "Vert": "/illustrations/clothing-green.png",
    },
    "size": {
      "S": "/illustrations/clothing-small.png",
      "M": "/illustrations/clothing-medium.png",
      "L": "/illustrations/clothing-large.png",
      "XL": "/illustrations/clothing-xlarge.png",
      "XXL": "/illustrations/clothing-xxlarge.png",
      "Unique": "/illustrations/clothing.png",
    },
    "print_design": {
      "logo": "/illustrations/clothing-logo.png",
      "abstract": "/illustrations/clothing-abstract.png",
      "photo": "/illustrations/clothing-photo.png",
    },
  },
  "t-shirts": {
    "color": {
      "red": "/illustrations/tshirt-red.png",
      "blue": "/illustrations/tshirt-blue.png",
      "green": "/illustrations/tshirt-green.png",
      "black": "/illustrations/tshirt-black.png",
      "white": "/illustrations/tshirt-white.png",
      "Noir": "/illustrations/tshirt-black.png",
      "Blanc": "/illustrations/tshirt-white.png",
      "Bleu": "/illustrations/tshirt-blue.png",
      "Rouge": "/illustrations/tshirt-red.png",
      "Vert": "/illustrations/tshirt-green.png",
    },
    "size": {
      "S": "/illustrations/tshirt-small.png",
      "M": "/illustrations/tshirt-medium.png",
      "L": "/illustrations/tshirt-large.png",
      "XL": "/illustrations/tshirt-xlarge.png",
      "XXL": "/illustrations/tshirt-xxlarge.png",
    },
    "print_design": {
      "logo": "/illustrations/tshirt-logo.png",
      "abstract": "/illustrations/tshirt-abstract.png",
      "photo": "/illustrations/tshirt-photo.png",
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
    "size": {
      "S": "/illustrations/hoodie-small.png",
      "M": "/illustrations/hoodie-medium.png",
      "L": "/illustrations/hoodie-large.png",
      "XL": "/illustrations/hoodie-xlarge.png",
      "XXL": "/illustrations/hoodie-xxlarge.png",
    },
    "print_design": {
      "logo": "/illustrations/hoodie-logo.png",
      "abstract": "/illustrations/hoodie-abstract.png",
      "photo": "/illustrations/hoodie-photo.png",
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
    "design": {
      "funny": "/illustrations/mug-funny.png",
      "motivational": "/illustrations/mug-motivational.png",
      "custom": "/illustrations/mug-custom.png",
    },
  },
  "posters": {
    "size": {
      "A3": "/illustrations/poster-a3.png",
      "A2": "/illustrations/poster-a2.png",
      "A1": "/illustrations/poster-a1.png",
    },
    "paper_type": {
      "glossy": "/illustrations/poster-glossy.png",
      "matte": "/illustrations/poster-matte.png",
    },
  },
  "stickers": {
    "size": {
      "small": "/illustrations/sticker-small.png",
      "medium": "/illustrations/sticker-medium.png",
      "large": "/illustrations/sticker-large.png",
    },
    "finish": {
      "glossy": "/illustrations/sticker-glossy.png",
      "matte": "/illustrations/sticker-matte.png",
      "transparent": "/illustrations/sticker-transparent.png",
    },
  },
  "accessoires": {
    "color": {
      "red": "/illustrations/accessory-red.png",
      "blue": "/illustrations/accessory-blue.png",
      "green": "/illustrations/accessory-green.png",
      "black": "/illustrations/accessory-black.png",
      "white": "/illustrations/accessory-white.png",
      "Noir": "/illustrations/accessory-black.png",
      "Blanc": "/illustrations/accessory-white.png",
      "Bleu": "/illustrations/accessory-blue.png",
      "Rouge": "/illustrations/accessory-red.png",
      "Vert": "/illustrations/accessory-green.png",
    },
    "size": {
      "S": "/illustrations/accessory-small.png",
      "M": "/illustrations/accessory-medium.png",
      "L": "/illustrations/accessory-large.png",
      "XL": "/illustrations/accessory-xlarge.png",
      "XXL": "/illustrations/accessory-xxlarge.png",
      "Unique": "/illustrations/accessory.png",
    },
  },
  "casquettes": {
    "color": {
      "red": "/illustrations/cap-red.png",
      "blue": "/illustrations/cap-blue.png",
      "green": "/illustrations/cap-green.png",
      "black": "/illustrations/cap-black.png",
      "white": "/illustrations/cap-white.png",
      "Noir": "/illustrations/cap-black.png",
      "Blanc": "/illustrations/cap-white.png",
      "Bleu": "/illustrations/cap-blue.png",
      "Rouge": "/illustrations/cap-red.png",
      "Vert": "/illustrations/cap-green.png",
    },
    "size": {
      "Unique": "/illustrations/cap.png",
    },
  },
  "velo": {
    "color": {
      "Noir": "/placeholder.svg",
      "Blanc": "/placeholder.svg",
      "Bleu": "/placeholder.svg",
      "Rouge": "/placeholder.svg",
      "Vert": "/placeholder.svg",
      "Jaune": "/placeholder.svg",
    },
    "type": {
      "VTT": "/placeholder.svg",
      "Route": "/placeholder.svg",
      "Ville": "/placeholder.svg",
      "Électrique": "/placeholder.svg",
    },
  },
  "maison": {  // Ajout des illustrations pour la catégorie "maison"
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
    "design": {
      "funny": "/illustrations/mug-funny.png",
      "motivational": "/illustrations/mug-motivational.png",
      "custom": "/illustrations/mug-custom.png",
    },
  },
};

// Function to get feature illustration for a product category
export const getFeatureIllustration = (product: Product | undefined, variants: Record<string, string>): string => {
  if (!product) {
    return '/placeholder.svg';
  }
  
  const category = product.subcategory || product.category;
  
  // Si c'est un vêtement avec couleur et taille, montrer l'illustration spécifique
  if ((category === 't-shirts' || category === 'hoodies' || category === 'vêtements') && variants.color && variants.size) {
    return variantIllustrations[category]?.color?.[variants.color] || defaultIllustrations[category] || getPlaceholderImage(category);
  }
  
  // Pour les mugs avec couleur
  if ((category === 'mugs' || category === 'maison') && variants.color) {
    return variantIllustrations['mugs']?.color?.[variants.color] || defaultIllustrations['mugs'] || getPlaceholderImage(category);
  }
  
  // Pour les casquettes avec couleur
  if (category === 'casquettes' && variants.color) {
    return variantIllustrations[category]?.color?.[variants.color] || defaultIllustrations[category] || getPlaceholderImage(category);
  }
  
  // Pour les vélos avec type
  if (category === 'velo' && variants.type) {
    return variantIllustrations[category]?.type?.[variants.type] || defaultIllustrations[category] || getPlaceholderImage(category);
  }
  
  // Default: return category illustration or placeholder
  return defaultIllustrations[category] || getPlaceholderImage(category);
};

// Function to get variant illustration for a product feature
export const getVariantIllustration = (category: string, variantType: string, variantValue: string): string => {
  // Si la catégorie est "maison" et la sous-catégorie est "mugs", utiliser les illustrations de mugs
  if (category === 'maison' && variantType === 'color') {
    return variantIllustrations['mugs']?.color?.[variantValue] || 
           variantIllustrations['mugs']?.color?.[variantValue.toLowerCase()] || 
           getPlaceholderImage('mugs');
  }
  
  if (category === 'maison' && variantType === 'design') {
    return variantIllustrations['mugs']?.design?.[variantValue] || 
           variantIllustrations['mugs']?.design?.[variantValue.toLowerCase()] || 
           getPlaceholderImage('mugs');
  }
  
  return variantIllustrations[category]?.[variantType]?.[variantValue] || 
         variantIllustrations[category]?.[variantType]?.[variantValue.toLowerCase()] || 
         getPlaceholderImage(category);
};
