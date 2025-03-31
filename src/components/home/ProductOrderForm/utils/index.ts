
// Re-export functions from all utils files
export { 
  getAvailableVariants
} from './configs/availableVariants';

export { 
  getVariantOptions
} from './configs/variantOptions';

export {
  getQuantityOptions
} from './configs/quantityOptions';

export { 
  extractVariantOptionsFromProduct 
} from './parsingUtils';

// Export illustration utilities
export {
  getFeatureIllustration,
  getVariantIllustration,
  getVariantImage
} from './illustrationUtils';

// Export variant display utilities
export {
  getVariantDisplayName,
  parseVariantListString
} from './variantDisplay';
