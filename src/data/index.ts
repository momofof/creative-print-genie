
// Main index file to import and re-export all product data
import { productCategories } from './categories';
import { featuredProducts, categoryPills } from './featuredProducts';
import { textileProducts } from './products/textileProducts';
import { papierProducts } from './products/papierProducts';
import { vinylProducts } from './products/vinylProducts';
import { accessoiresProducts } from './products/accessoiresProducts';
import { panneauxProducts } from './products/panneauxProducts';
import { enseignesProducts } from './products/enseignesProducts';
import { vehiculesProducts } from './products/vehiculesProducts';
import { ustensilesProducts } from './products/ustensilesProducts';
import { bijouxProducts } from './products/bijouxProducts';
import { emballageProducts } from './products/emballageProducts';

// Combine all products into one array for the "allProducts" export
export const allProducts = [
  ...textileProducts,
  ...papierProducts,
  ...vinylProducts,
  ...accessoiresProducts,
  ...panneauxProducts,
  ...enseignesProducts,
  ...vehiculesProducts,
  ...ustensilesProducts,
  ...bijouxProducts,
  ...emballageProducts
];

// Re-export everything for backward compatibility
export {
  productCategories,
  featuredProducts,
  categoryPills,
  textileProducts,
  papierProducts,
  vinylProducts,
  accessoiresProducts,
  panneauxProducts,
  enseignesProducts,
  vehiculesProducts,
  ustensilesProducts,
  bijouxProducts,
  emballageProducts
};
