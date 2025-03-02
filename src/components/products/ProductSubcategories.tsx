
import { Link } from "react-router-dom";

interface ProductSubcategoriesProps {
  categoryId: string;
  subcategories: string[];
}

const ProductSubcategories = ({ categoryId, subcategories }: ProductSubcategoriesProps) => {
  return (
    <div className="container mx-auto px-4 mb-10">
      <div className="flex flex-wrap gap-2">
        {subcategories.map((subcategory, index) => (
          <Link 
            key={index}
            to={`/products/${categoryId}/${subcategory.toLowerCase().replace(/\s+/g, '-')}`}
            className="px-4 py-2 bg-gray-100 hover:bg-teal-100 rounded-full text-sm transition-colors"
          >
            {subcategory}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductSubcategories;
