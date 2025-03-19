
import Navigation from "@/components/Navigation";
import { productCategories, allProducts } from "@/data";
import { useParams } from "react-router-dom";
import CategoryDetailView from "@/components/products/CategoryDetailView";
import ProductList from "@/components/products/ProductList";
import ProductCatalog from "@/components/products/ProductCatalog";

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
    
  // Filter products based on category and subcategory
  const filteredProducts = allProducts.filter(product => {
    if (categoryId && subcategoryId) {
      return product.category === categoryId && product.subcategory === subcategoryId;
    } else if (categoryId) {
      return product.category === categoryId;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {categoryId ? (
        // Vue détaillée de catégorie spécifique
        <>
          <CategoryDetailView category={currentCategory!} />
          
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">{subcategoryId || currentCategory?.title}</h2>
            <ProductList products={filteredProducts} />
          </div>
        </>
      ) : (
        // Page principale simplifiée avec uniquement le catalogue
        <ProductCatalog />
      )}
    </div>
  );
};

export default Products;
