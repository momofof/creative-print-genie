
import Navigation from "@/components/Navigation";
import { productCategories } from "@/data/productData";
import { useParams } from "react-router-dom";
import CategoryDetailView from "@/components/products/CategoryDetailView";
import CategoriesOverview from "@/components/products/CategoriesOverview";

const Products = () => {
  const { categoryId } = useParams();
  
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
        <CategoryDetailView category={currentCategory} />
      ) : (
        <CategoriesOverview displayedCategories={displayedCategories} />
      )}
    </div>
  );
};

export default Products;
