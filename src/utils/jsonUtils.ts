
import { Json } from "@/integrations/supabase/types";
import { ProductVariant, Customization } from "@/types/dashboard";

/**
 * Parse JSON array from Supabase JSONB data
 */
export const parseJsonArray = (jsonData: Json): any[] => {
  if (Array.isArray(jsonData)) {
    return jsonData;
  } else if (jsonData && typeof jsonData === 'object') {
    return Object.values(jsonData);
  }
  return [];
};

/**
 * Parse product variants from JSONB
 */
export const parseProductVariants = (jsonData: Json): ProductVariant[] => {
  const parsedVariants = parseJsonArray(jsonData);
  
  // Ensure proper typing of variants
  return parsedVariants.map(variant => ({
    id: variant.id || '',
    product_id: variant.product_id || '',
    size: variant.size || '',
    color: variant.color || '',
    hex_color: variant.hex_color || '#000000',
    stock: variant.stock || 0,
    price_adjustment: variant.price_adjustment || 0,
    status: variant.status || 'in_stock',
    created_at: variant.created_at || '',
    updated_at: variant.updated_at || ''
  }));
};

/**
 * Parse customizations from JSONB
 */
export const parseCustomizations = (jsonData: Json): Customization[] => {
  const parsedCustomizations = parseJsonArray(jsonData);
  
  // Ensure proper typing of customizations
  return parsedCustomizations.map(custom => ({
    id: custom.id || '',
    name: custom.name || '',
    description: custom.description || null,
    product_id: custom.product_id || null,
    type: custom.type || 'text',
    position: custom.position || null,
    price_adjustment: custom.price_adjustment || null,
    is_required: custom.is_required || null,
    created_at: custom.created_at || null,
    updated_at: custom.updated_at || null
  }));
};
