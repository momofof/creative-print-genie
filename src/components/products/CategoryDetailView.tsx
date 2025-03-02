
import ProductHero from "./ProductHero";
import ProductBreadcrumbs from "./ProductBreadcrumbs";
import ProductSubcategories from "./ProductSubcategories";
import { Filter } from "lucide-react";

interface CategoryDetailViewProps {
  category: {
    id: string;
    title: string;
    image: string;
    subcategories: string[];
  };
}

const CategoryDetailView = ({ category }: CategoryDetailViewProps) => {
  return (
    <div className="pt-24 pb-8">
      <ProductHero 
        categoryImage={category.image} 
        categoryTitle={category.title} 
      />
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
          <ProductBreadcrumbs categoryTitle={category.title} />
          
          <div className="hidden md:flex items-center gap-2 text-sm">
            <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span>Filtres</span>
            </button>
            <button className="px-3 py-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-50">
              Guide des tailles
            </button>
          </div>
        </div>
      </div>
      
      <ProductSubcategories 
        categoryId={category.id}
        subcategories={category.subcategories}
      />
    </div>
  );
};

export default CategoryDetailView;
