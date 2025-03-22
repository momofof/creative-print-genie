
import { Product } from "@/types/dashboard";

export interface CSVProductData {
  name: string;
  price: number;
  original_price?: number;
  category: string;
  subcategory?: string;
  description?: string;
  status?: "draft" | "published" | "archived";
  is_customizable?: boolean;
  // Champs de variantes
  size?: string;
  color?: string;
  hex_color?: string;
  stock?: number;
  price_adjustment?: number;
  variant_status?: "in_stock" | "low_stock" | "out_of_stock";
  bat?: string;
  poids?: string;
  format?: string;
  quantite?: string;
  echantillon?: string;
  types_impression?: string;
  type_de_materiaux?: string;
  details_impression?: string;
  orientation_impression?: string;
}

/**
 * Parse CSV file content into product data
 */
export const parseCSV = (text: string): CSVProductData[] => {
  const lines = text.split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  
  const products: CSVProductData[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = line.split(',').map(val => val.trim());
    
    // Créer un nouveau produit
    const product: CSVProductData = {
      name: values[headers.indexOf('name')],
      price: parseFloat(values[headers.indexOf('price')]),
      category: values[headers.indexOf('category')]
    };
    
    // Ajouter les champs optionnels
    const addFieldIfExists = (fieldName: keyof CSVProductData, parser?: (val: string) => any) => {
      const index = headers.indexOf(fieldName as string);
      if (index !== -1 && values[index]) {
        const parsed = parser ? parser(values[index]) : values[index];
        (product as any)[fieldName] = parsed;
      }
    };
    
    // Champs de base du produit
    addFieldIfExists('description');
    addFieldIfExists('original_price', val => parseFloat(val));
    addFieldIfExists('subcategory');
    addFieldIfExists('status');
    addFieldIfExists('is_customizable', val => val.toLowerCase() === 'true');
    
    // Champs de variantes
    addFieldIfExists('size');
    addFieldIfExists('color');
    addFieldIfExists('hex_color');
    addFieldIfExists('stock', val => parseInt(val, 10));
    addFieldIfExists('price_adjustment', val => parseFloat(val));
    addFieldIfExists('variant_status');
    addFieldIfExists('bat');
    addFieldIfExists('poids');
    addFieldIfExists('format');
    addFieldIfExists('quantite');
    addFieldIfExists('echantillon');
    addFieldIfExists('types_impression');
    addFieldIfExists('type_de_materiaux');
    addFieldIfExists('details_impression');
    addFieldIfExists('orientation_impression');
    
    products.push(product);
  }
  
  return products;
};
