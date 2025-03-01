
import { Link } from "react-router-dom";
import { productCategories } from "@/data/productData";

const ProductCategories = () => {
  return (
    <section className="px-4 bg-white py-6 sm:py-[35px]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 text-center">Catégories de Produits</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {productCategories.map(category => (
            <Link 
              key={category.id} 
              to={`/products/${category.id}`} 
              className="group bg-secondary rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square w-full overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.title} 
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300" 
                />
              </div>
              <div className="p-2">
                <h3 className="text-xs sm:text-sm font-medium mb-1 group-hover:text-accent transition-colors">
                  {category.title}
                </h3>
                <ul className="space-y-0.5 hidden sm:block">
                  {category.subcategories.map((subcategory, index) => (
                    <li key={index} className="text-xs text-gray-600">
                      {subcategory}
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;
