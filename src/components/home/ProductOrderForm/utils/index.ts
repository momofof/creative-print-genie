
// Re-export functions from all utils files
export { 
  getAvailableVariants, 
  getVariantOptions, 
  getQuantityOptions 
} from './variantConfig';

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
  getVariantDisplayName
} from './variantDisplay';
