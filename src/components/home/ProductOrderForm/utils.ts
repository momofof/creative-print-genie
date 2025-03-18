import { Product } from "@/types/product";

// Quantity options for different product categories
export const quantityOptions = {
  textile: [1, 5, 10, 25, 50, 100],
  papier: [50, 100, 250, 500, 1000, 2000],
  vinyl: [1, 5, 10, 25, 50, 100],
  accessoires: [1, 5, 10, 25, 50],
  emballage: [10, 25, 50, 100, 200]
};

// Category-specific variants
export const categoryVariants = {
  textile: {
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
    colors: ["Blanc", "Noir", "Bleu", "Rouge", "Vert", "Jaune", "Gris"],
    materials: ["Coton", "Polyester", "Coton Bio", "Mélange", "Lycra", "Lin"],
    styles: ["T-shirt", "Polo", "Sweat", "Hoodie", "Débardeur", "Chemise"]
  },
  papier: {
    sizes: ["A6", "A5", "A4", "A3", "A2", "A1", "Carte de visite", "Flyer"],
    colors: ["Blanc", "Ivoire", "Recyclé", "Coloré", "Kraft"],
    thickness: ["80g", "100g", "120g", "170g", "250g", "300g", "350g"],
    printDetails: ["Recto", "Recto-Verso", "Quadri", "Pantone", "Vernis"],
    paperTypes: ["Standard", "Recyclé", "Créatif", "Couché Mat", "Couché Brillant", "Texturé"],
    folding: ["Sans pli", "Pli simple", "Pli accordéon", "Pli roulé", "Pli fenêtre"],
    foldingStyles: ["2 volets", "3 volets", "4 volets", "Dépliant", "Livret", "Z-fold"]
  },
  vinyl: {
    sizes: ["Petit (10x10cm)", "Moyen (30x30cm)", "Grand (50x50cm)", "XL (100x100cm)", "Sur mesure"],
    colors: ["Transparent", "Blanc", "Noir", "Couleur unie", "Multicolore"],
    materials: ["PVC", "Vinyle monomère", "Vinyle polymère", "Microperforé", "Adhésif"],
    finishes: ["Mat", "Brillant", "Satiné", "Anti-UV", "Anti-rayures"]
  },
  accessoires: {
    colors: ["Blanc", "Noir", "Bleu", "Rouge", "Vert", "Multicolore", "Naturel"],
    materials: ["Céramique", "Plastique", "Métal", "Verre", "Bois", "Silicone", "Textile"],
    sizes: ["Standard", "Mini", "Maxi", "Voyage", "XL"],
    styles: ["Classique", "Moderne", "Vintage", "Sport", "Luxe", "Minimaliste"]
  },
  emballage: {
    sizes: ["XS", "S", "M", "L", "XL", "Sur mesure"],
    materials: ["Carton", "Kraft", "Recyclé", "Papier", "Plastique biodégradable"],
    colors: ["Blanc", "Kraft", "Noir", "Coloré", "Transparent"],
    finishes: ["Mat", "Brillant", "Satiné", "Soft-touch", "Métallisé"],
    techniques: ["Impression quadri", "Dorure", "Gaufrage", "Vernis sélectif", "Découpe forme"]
  }
};

// Illustration images for variants
export const variantIllustrations = {
  textile: {
    sizes: {
      "XS": "/lovable-uploads/37a81eff-34b6-47cc-b819-69f72dfebbde.png",
      "S": "/lovable-uploads/37a81eff-34b6-47cc-b819-69f72dfebbde.png",
      "M": "/lovable-uploads/37a81eff-34b6-47cc-b819-69f72dfebbde.png",
      "L": "/lovable-uploads/37a81eff-34b6-47cc-b819-69f72dfebbde.png",
      "XL": "/lovable-uploads/37a81eff-34b6-47cc-b819-69f72dfebbde.png",
      "XXL": "/lovable-uploads/37a81eff-34b6-47cc-b819-69f72dfebbde.png",
      "3XL": "/lovable-uploads/37a81eff-34b6-47cc-b819-69f72dfebbde.png",
    },
    colors: {
      "Blanc": "/lovable-uploads/5c3e6357-3bff-4033-85a4-fc23513fc793.png",
      "Noir": "/lovable-uploads/83279871-e720-4ac6-9c14-23e50fecfa8d.png",
      "Bleu": "/lovable-uploads/1365a433-cc0b-4382-8d64-0402ccf2eccd.png",
      "Rouge": "/lovable-uploads/9c50297c-4e85-4eba-92cf-1786dbe7853d.png",
      "Vert": "/lovable-uploads/65ec5eab-d704-46ee-823c-35a148087669.png",
      "Jaune": "/lovable-uploads/65ec5eab-d704-46ee-823c-35a148087669.png",
      "Gris": "/lovable-uploads/83279871-e720-4ac6-9c14-23e50fecfa8d.png",
    },
    materials: {
      "Coton": "/lovable-uploads/d28240cb-3480-4969-9eaf-7e5a3db73a93.png",
      "Polyester": "/lovable-uploads/a613bb1a-34de-4d67-a4ea-8e2b4c720279.png",
      "Coton Bio": "/lovable-uploads/d28240cb-3480-4969-9eaf-7e5a3db73a93.png",
      "Mélange": "/lovable-uploads/a613bb1a-34de-4d67-a4ea-8e2b4c720279.png",
      "Lycra": "/lovable-uploads/a613bb1a-34de-4d67-a4ea-8e2b4c720279.png",
      "Lin": "/lovable-uploads/d28240cb-3480-4969-9eaf-7e5a3db73a93.png",
    },
    styles: {
      "T-shirt": "/lovable-uploads/9850efb4-ef57-4de7-8707-ef1e82277265.png",
      "Polo": "/lovable-uploads/694400ee-4ddd-4bce-8e5e-3941e06b6777.png",
      "Sweat": "/lovable-uploads/c00742ed-9c77-47e2-97c4-41a9401e0f18.png",
      "Hoodie": "/lovable-uploads/c00742ed-9c77-47e2-97c4-41a9401e0f18.png",
      "Débardeur": "/lovable-uploads/9850efb4-ef57-4de7-8707-ef1e82277265.png",
      "Chemise": "/lovable-uploads/694400ee-4ddd-4bce-8e5e-3941e06b6777.png",
    }
  },
  papier: {
    sizes: {
      "A6": "/lovable-uploads/d3ae8f29-2c71-4cc2-8d20-f6b99685c61c.png",
      "A5": "/lovable-uploads/d3ae8f29-2c71-4cc2-8d20-f6b99685c61c.png",
      "A4": "/lovable-uploads/d3ae8f29-2c71-4cc2-8d20-f6b99685c61c.png",
      "A3": "/lovable-uploads/d3ae8f29-2c71-4cc2-8d20-f6b99685c61c.png",
      "A2": "/lovable-uploads/d3ae8f29-2c71-4cc2-8d20-f6b99685c61c.png",
      "A1": "/lovable-uploads/d3ae8f29-2c71-4cc2-8d20-f6b99685c61c.png",
      "Carte de visite": "/lovable-uploads/d3ae8f29-2c71-4cc2-8d20-f6b99685c61c.png",
      "Flyer": "/lovable-uploads/d3ae8f29-2c71-4cc2-8d20-f6b99685c61c.png",
    },
  },
  // Other categories have placeholder illustrations
};

// Default fallback image
export const defaultIllustration = "/lovable-uploads/42f681a1-997f-45a3-aaf6-b01d41e79b33.png";

// Get variant display name
export const getVariantDisplayName = (variantType: string): string => {
  const displayNames: Record<string, string> = {
    sizes: "Taille",
    colors: "Couleur",
    materials: "Matériau",
    styles: "Style",
    thickness: "Épaisseur",
    printDetails: "Détails d'impression",
    paperTypes: "Type de papier",
    folding: "Pliage",
    foldingStyles: "Style de pliage",
    finishes: "Finition",
    techniques: "Technique"
  };
  
  return displayNames[variantType] || variantType;
};

// Get quantity options based on selected product category
export const getQuantityOptions = (category: string): number[] => {
  const categoryKey = category as keyof typeof quantityOptions;
  return quantityOptions[categoryKey] || quantityOptions.textile;
};

// Get variant options for a specific variant type and product category
export const getVariantOptions = (productCategory: string, variantType: string): string[] => {
  const category = productCategory as keyof typeof categoryVariants;
  if (!categoryVariants[category]) return [];
  
  // TypeScript needs this type assertion to access the dynamic property
  return (categoryVariants[category] as any)[variantType] || [];
};

// Get available variant types for a specific product category
export const getAvailableVariants = (productCategory: string): string[] => {
  const category = productCategory as keyof typeof categoryVariants;
  return categoryVariants[category] ? Object.keys(categoryVariants[category]) : [];
};

// Get illustration image for a specific variant
export const getVariantIllustration = (category: string, variantType: string, variantValue: string): string => {
  const categoryKey = category as keyof typeof variantIllustrations;
  
  if (
    variantIllustrations[categoryKey] && 
    (variantIllustrations[categoryKey] as any)[variantType] && 
    (variantIllustrations[categoryKey] as any)[variantType][variantValue]
  ) {
    return (variantIllustrations[categoryKey] as any)[variantType][variantValue];
  }
  
  return defaultIllustration;
};

// Get the currently featured illustration based on most recently selected variant
export const getFeatureIllustration = (product: Product | undefined, variants: Record<string, string>): string => {
  if (!product || Object.keys(variants).length === 0) return defaultIllustration;
  
  // Get the last selected variant for illustration
  const variantKeys = Object.keys(variants);
  if (variantKeys.length > 0) {
    const lastVariantType = variantKeys[variantKeys.length - 1];
    const lastVariantValue = variants[lastVariantType];
    return getVariantIllustration(product.category, lastVariantType, lastVariantValue);
  }
  
  return defaultIllustration;
};
