
import { Product, ProductVariant } from "@/types/dashboard";

export interface CSVProductData {
  name: string;
  price: number;
  original_price?: number;
  category: string;
  subcategory?: string;
  description?: string;
  status?: "draft" | "published" | "archived";
  is_customizable?: boolean;
  variants?: {
    size: string;
    color: string;
    hex_color: string;
    stock: number;
    price_adjustment?: number;
    status?: "in_stock" | "low_stock" | "out_of_stock";
  }[];
}

/**
 * Parse CSV file content into product data
 */
export const parseCSV = (text: string): CSVProductData[] => {
  const lines = text.split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  
  const products: CSVProductData[] = [];
  let currentProduct: CSVProductData | null = null;
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = line.split(',').map(val => val.trim());
    
    // Check if this is a product line or variant line
    if (values[0]) { // New product
      if (currentProduct) {
        products.push(currentProduct);
      }
      
      currentProduct = {
        name: values[headers.indexOf('name')],
        price: parseFloat(values[headers.indexOf('price')]),
        category: values[headers.indexOf('category')],
        variants: []
      };
      
      // Add optional fields
      const descriptionIndex = headers.indexOf('description');
      if (descriptionIndex !== -1 && values[descriptionIndex]) {
        currentProduct.description = values[descriptionIndex];
      }
      
      const originalPriceIndex = headers.indexOf('original_price');
      if (originalPriceIndex !== -1 && values[originalPriceIndex]) {
        currentProduct.original_price = parseFloat(values[originalPriceIndex]);
      }
      
      const subcategoryIndex = headers.indexOf('subcategory');
      if (subcategoryIndex !== -1 && values[subcategoryIndex]) {
        currentProduct.subcategory = values[subcategoryIndex];
      }
      
      const statusIndex = headers.indexOf('status');
      if (statusIndex !== -1 && values[statusIndex]) {
        const status = values[statusIndex] as "draft" | "published" | "archived";
        currentProduct.status = status;
      } else {
        currentProduct.status = "draft";
      }
      
      const customizableIndex = headers.indexOf('is_customizable');
      if (customizableIndex !== -1) {
        currentProduct.is_customizable = values[customizableIndex].toLowerCase() === 'true';
      }
    } else if (currentProduct && currentProduct.variants && values[headers.indexOf('size')]) {
      // This is a variant line
      const variant = {
        size: values[headers.indexOf('size')],
        color: values[headers.indexOf('color')],
        hex_color: values[headers.indexOf('hex_color')],
        stock: parseInt(values[headers.indexOf('stock')], 10) || 0
      };
      
      const priceAdjustmentIndex = headers.indexOf('price_adjustment');
      if (priceAdjustmentIndex !== -1 && values[priceAdjustmentIndex]) {
        variant['price_adjustment'] = parseFloat(values[priceAdjustmentIndex]);
      }
      
      const variantStatusIndex = headers.indexOf('variant_status');
      if (variantStatusIndex !== -1 && values[variantStatusIndex]) {
        variant['status'] = values[variantStatusIndex] as "in_stock" | "low_stock" | "out_of_stock";
      } else {
        variant['status'] = "in_stock";
      }
      
      currentProduct.variants.push(variant);
    }
  }
  
  // Add the last product
  if (currentProduct) {
    products.push(currentProduct);
  }
  
  return products;
};
