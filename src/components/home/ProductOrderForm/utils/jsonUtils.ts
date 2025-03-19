
import { parseJsonArray } from "@/utils/jsonUtils";

// Parse variants object from product data - optimized version
export const parseVariants = (data: any): any[] => {
  return parseJsonArray(data);
};
