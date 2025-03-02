
import Navigation from "@/components/Navigation";
import { productCategories } from "@/data/productData";
import { useParams } from "react-router-dom";
import CategoryDetailView from "@/components/products/CategoryDetailView";
import CategoriesOverview from "@/components/products/CategoriesOverview";
import ProductList from "@/components/products/ProductList";
import NewArrivalsSection from "@/components/products/NewArrivalsSection";
import PromotionalBanner from "@/components/products/PromotionalBanner";
import DesignServiceBanner from "@/components/products/DesignServiceBanner";
import RecentlyViewedSection from "@/components/products/RecentlyViewedSection";

const Products = () => {
  const { categoryId, subcategoryId } = useParams();
  
  // Filter categories based on URL parameters
  const displayedCategories = categoryId 
    ? productCategories.filter(cat => cat.id === categoryId) 
    : productCategories;

  // Find the current category if we're on a specific category page
  const currentCategory = categoryId 
    ? productCategories.find(cat => cat.id === categoryId)
    : null;

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {currentCategory ? (
        <>
          <CategoryDetailView category={currentCategory} />
          
          {subcategoryId ? (
            <ProductList categoryId={categoryId} subcategoryId={subcategoryId} />
          ) : (
            <ProductList categoryId={categoryId} />
          )}
        </>
      ) : (
        <CategoriesOverview displayedCategories={displayedCategories} />
      )}

      {/* Sections promotionnelles placées après la liste de produits pour toutes les vues */}
      <NewArrivalsSection categoryTitle={currentCategory?.title || "Nos produits"} />
      <PromotionalBanner />
      <DesignServiceBanner />
      <RecentlyViewedSection categoryTitle={currentCategory?.title || "Nos produits"} />
    </div>
  );
};

export default Products;
