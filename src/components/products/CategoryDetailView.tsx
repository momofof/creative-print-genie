
import ProductHero from "./ProductHero";
import ProductBreadcrumbs from "./ProductBreadcrumbs";
import ProductSubcategories from "./ProductSubcategories";
import PopularStylesSection from "./PopularStylesSection";
import FeaturedCollectionSection from "./FeaturedCollectionSection";
import NewArrivalsSection from "./NewArrivalsSection";
import PromotionalBanner from "./PromotionalBanner";
import DesignServiceBanner from "./DesignServiceBanner";
import RecentlyViewedSection from "./RecentlyViewedSection";

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
      
      <PopularStylesSection categoryTitle={category.title} />
      
      <FeaturedCollectionSection />
      
      <NewArrivalsSection categoryTitle={category.title} />
      
      <PromotionalBanner />
      
      <DesignServiceBanner />
      
      <RecentlyViewedSection categoryTitle={category.title} />
    </div>
  );
};

export default CategoryDetailView;
