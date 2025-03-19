
import Navigation from "@/components/Navigation";
import { productCategories } from "@/data/productData";
import { useParams } from "react-router-dom";
import ProductsLoading from "@/components/products/ProductsLoading";
import CategoryView from "@/components/products/CategoryView";
import CatalogView from "@/components/products/CatalogView";
import ProductsPromotionalSections from "@/components/products/ProductsPromotionalSections";
import { useProductsData } from "@/hooks/useProductsData";

const Products = () => {
  const { categoryId, subcategoryId } = useParams();
  const { products, isLoading } = useProductsData(categoryId, subcategoryId);
  
  // Find the current category if we're on a specific category page
  const currentCategory = categoryId 
    ? productCategories.find(cat => cat.id === categoryId)
    : null;
    
  // Display categories based on URL parameters
  const displayedCategories = categoryId 
    ? productCategories.filter(cat => cat.id === categoryId) 
    : productCategories;

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {isLoading ? (
        <ProductsLoading />
      ) : (
        <>
          {currentCategory ? (
            <CategoryView 
              category={currentCategory} 
              products={products} 
              subcategoryId={subcategoryId}
            />
          ) : (
            <CatalogView 
              displayedCategories={displayedCategories} 
              products={products} 
            />
          )}

          {/* Sections promotionnelles placées après la liste de produits pour toutes les vues */}
          <ProductsPromotionalSections 
            categoryTitle={currentCategory?.title || "Nos produits"} 
          />
        </>
      )}
    </div>
  );
};

export default Products;
