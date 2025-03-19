
import { Json } from "@/integrations/supabase/types";

/**
 * Safely parses JSON array data from Supabase
 * @param jsonData The JSON data from Supabase
 * @returns An array of JSON objects
 */
export const parseJsonArray = (jsonData: Json | null | undefined): any[] => {
  if (!jsonData) return [];
  
  if (Array.isArray(jsonData)) {
    return jsonData;
  }
  
  try {
    // If it's a string, try to parse it
    if (typeof jsonData === 'string') {
      const parsed = JSON.parse(jsonData);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.error("Error parsing JSON array:", error);
  }
  
  return [];
};

/**
 * Convert a value to a format suitable for Supabase JSON storage
 * @param value The value to convert to JSON
 * @returns A JSON-compatible value
 */
export const toJsonValue = (value: any): Json => {
  // If it's already a primitive type accepted by Supabase, return it
  if (
    value === null || 
    typeof value === 'string' || 
    typeof value === 'number' || 
    typeof value === 'boolean'
  ) {
    return value as Json;
  }

  // If it's an array, convert each element
  if (Array.isArray(value)) {
    return value.map(item => toJsonValue(item)) as Json[];
  }

  // If it's an object, convert each property
  if (typeof value === 'object') {
    const result: Record<string, Json> = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        result[key] = toJsonValue(value[key]);
      }
    }
    return result;
  }

  // Fallback - convert to string
  return String(value) as Json;
};

// Add the missing functions that were referenced in the error messages
import { ProductVariant, Customization } from "@/types/dashboard";

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
