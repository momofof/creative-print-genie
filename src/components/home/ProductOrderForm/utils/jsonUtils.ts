
import { parseJsonArray } from "@/utils/jsonUtils";

// Parse variants object from product data - optimized version with error handling
export const parseVariants = (data: any): any[] => {
  try {
    return parseJsonArray(data);
  } catch (error) {
    console.error("Error parsing variants:", error);
    return [];
  }
};
