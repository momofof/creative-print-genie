
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
