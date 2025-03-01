
import { Link } from "react-router-dom";
import { categoryPills } from "@/data/productData";

const CategoryPills = () => {
  return (
    <section className="bg-white py-4 sm:py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-start sm:justify-center gap-2 sm:gap-3 pb-2 sm:pb-0 overflow-x-auto scrollbar-none whitespace-nowrap">
          {categoryPills.map((category) => (
            <Link 
              key={category} 
              to={`/products/${category.toLowerCase().replace(" & ", "-")}`}
              className="whitespace-nowrap bg-gray-100 border border-gray-200 rounded-full px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium hover:bg-gray-200 transition-colors flex-shrink-0"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryPills;
