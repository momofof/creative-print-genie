
import ProductHero from "./ProductHero";
import ProductBreadcrumbs from "./ProductBreadcrumbs";
import ProductSubcategories from "./ProductSubcategories";

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
    <div className="pt-24 pb-16">
      <ProductHero 
        categoryImage={category.image} 
        categoryTitle={category.title} 
      />
      
      <ProductBreadcrumbs categoryTitle={category.title} />
      
      <ProductSubcategories 
        categoryId={category.id}
        subcategories={category.subcategories}
      />
    </div>
  );
};

export default CategoryDetailView;
