
import { Product } from "@/types/product";
import VariantSelector from "../VariantSelector";
import { getVariantDisplayName } from "../utils/variantDisplay";
import { getVariantOptions } from "../utils/variantConfig";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

interface ProductFormVariantsProps {
  selectedProduct: Product;
  variants: Record<string, string>;
  availableVariants: string[];
  onVariantChange: (variantType: string, value: string) => void;
  productVariantOptions: Record<string, string[]>;
}

const ProductFormVariants = ({
  selectedProduct,
  variants,
  availableVariants,
  onVariantChange,
  productVariantOptions
}: ProductFormVariantsProps) => {
  // Pagination state
  const VARIANTS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  
  // Get variant options prioritizing product-specific options if available
  const getOptionsForVariant = (variantType: string): string[] => {
    if (selectedProduct) {
      // Si des options spécifiques au produit existent pour cette variante, les utiliser
      if (productVariantOptions[variantType] && productVariantOptions[variantType].length > 0) {
        return productVariantOptions[variantType];
      }
      
      // Sinon, utiliser les options génériques basées sur la catégorie/sous-catégorie
      if (selectedProduct.subcategory) {
        const subcategoryOptions = getVariantOptions(selectedProduct.subcategory, variantType);
        if (subcategoryOptions.length > 0) {
          return subcategoryOptions;
        }
      }
      
      return getVariantOptions(selectedProduct.category, variantType);
    }
    
    return [];
  };

  // Group variants by type for better organization
  const groupVariants = () => {
    const groups = {
      appearance: ['color', 'size', 'print_design', 'design', 'paper_type', 'finish', 'face_a_imprimer'],
      format: ['quantite', 'format', 'type_de_materiaux', 'poids'],
      impression: ['details_impression', 'orientation_impression', 'types_impression'],
      extras: ['echantillon', 'bat']
    };
    
    // Sort the available variants into groups
    const groupedVariants: Record<string, string[]> = {
      appearance: [],
      format: [],
      impression: [],
      extras: [],
      other: [] // For any variants that don't fit in the above groups
    };
    
    availableVariants.forEach(variant => {
      let placed = false;
      for (const [group, variants] of Object.entries(groups)) {
        if (variants.includes(variant)) {
          groupedVariants[group].push(variant);
          placed = true;
          break;
        }
      }
      if (!placed) {
        groupedVariants["other"].push(variant);
      }
    });
    
    return groupedVariants;
  };
  
  const groupedVariants = groupVariants();

  // Flatten grouped variants for pagination
  const flattenedVariantGroups = useMemo(() => {
    const result: Array<{group: string, variants: string[]}> = [];
    
    Object.entries(groupedVariants).forEach(([group, groupVariants]) => {
      if (groupVariants.length > 0) {
        result.push({
          group,
          variants: groupVariants
        });
      }
    });
    
    return result;
  }, [groupedVariants]);
  
  // Calculate pagination data
  const totalGroups = flattenedVariantGroups.length;
  const totalPages = Math.max(1, Math.ceil(totalGroups / VARIANTS_PER_PAGE));
  
  // Get current page variants
  const currentPageGroups = useMemo(() => {
    const startIndex = (currentPage - 1) * VARIANTS_PER_PAGE;
    return flattenedVariantGroups.slice(startIndex, startIndex + VARIANTS_PER_PAGE);
  }, [flattenedVariantGroups, currentPage, VARIANTS_PER_PAGE]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of form for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (availableVariants.length === 0) {
    return null;
  }

  // Translate group names to French
  const groupDisplayNames: Record<string, string> = {
    appearance: "Apparence",
    format: "Format et dimensions",
    impression: "Options d'impression",
    extras: "Suppléments",
    other: "Autres options"
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-800">
        Options spécifiques {totalGroups > VARIANTS_PER_PAGE && <span className="text-sm font-normal text-gray-500">- Page {currentPage}/{totalPages}</span>}
      </h3>
      
      {currentPageGroups.map(({group, variants}) => (
        <div key={group} className="space-y-4">
          <h4 className="text-md font-medium text-gray-700">{groupDisplayNames[group]}</h4>
          <div className="grid grid-cols-1 gap-4">
            {variants.map((variantType) => (
              <VariantSelector
                key={variantType}
                variantType={variantType}
                displayName={getVariantDisplayName(variantType)}
                options={getOptionsForVariant(variantType)}
                selectedValue={variants[variantType] || ""}
                onChange={(value) => onVariantChange(variantType, value)}
                productCategory={selectedProduct.subcategory || selectedProduct.category}
              />
            ))}
          </div>
        </div>
      ))}
      
      {/* Pagination controls */}
      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink 
                  isActive={currentPage === i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default ProductFormVariants;

