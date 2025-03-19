
import { Link } from "react-router-dom";
import { productCategories } from "@/data/categories";

interface ProductCategoryGridProps {
  displayedCategories: typeof productCategories;
}

const ProductCategoryGrid = ({ displayedCategories }: ProductCategoryGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {displayedCategories.map((category) => (
        <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
          <Link to={`/products/${category.id}`} className="block aspect-video w-full overflow-hidden">
            <img 
              src={category.image} 
              alt={category.title} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
            />
          </Link>
          <div className="p-5">
            <Link to={`/products/${category.id}`}>
              <h2 className="text-xl font-semibold mb-3 hover:text-accent transition-colors">{category.title}</h2>
            </Link>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {category.subcategories.map((subcategory, index) => (
                <Link 
                  key={index} 
                  to={`/products/${category.id}/${subcategory.toLowerCase().replace(/\s+/g, '-')}`}
                  className="py-2 px-3 rounded-md bg-secondary/50 hover:bg-secondary hover:text-accent transition-colors text-sm"
                >
                  {subcategory}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCategoryGrid;
