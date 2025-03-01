
import Navigation from "@/components/Navigation";
import { productCategories } from "@/data/productData";
import { Link, useParams } from "react-router-dom";

const Products = () => {
  const { categoryId, subcategoryId } = useParams();
  
  // Filter categories based on URL parameters
  const displayedCategories = categoryId 
    ? productCategories.filter(cat => cat.id === categoryId) 
    : productCategories;

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-32 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Notre Catalogue</h1>
          <p className="text-lg text-gray-600 mb-10">
            Découvrez notre gamme complète de produits personnalisables.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-semibold mb-3">{category.title}</h2>
                  <div className="space-y-2">
                    {category.subcategories.map((subcategory, index) => (
                      <Link 
                        key={index} 
                        to={`/products/${category.id}/${subcategory.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block py-2 px-3 rounded-md bg-secondary/50 hover:bg-secondary hover:text-accent transition-colors text-sm"
                      >
                        {subcategory}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
