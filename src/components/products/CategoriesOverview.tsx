
import ProductCategoryGrid from "./ProductCategoryGrid";
import { productCategories } from "@/data/productData";

interface CategoriesOverviewProps {
  displayedCategories: typeof productCategories;
}

const CategoriesOverview = ({ displayedCategories }: CategoriesOverviewProps) => {
  return (
    <div className="pt-32 px-4 pb-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Notre Catalogue</h1>
        <p className="text-lg text-gray-600 mb-10">
          Découvrez notre gamme complète de produits personnalisables.
        </p>
        
        <ProductCategoryGrid displayedCategories={displayedCategories} />
      </div>
    </div>
  );
};

export default CategoriesOverview;
