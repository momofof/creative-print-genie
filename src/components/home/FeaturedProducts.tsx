
import { Link } from "react-router-dom";
import { featuredProducts } from "@/data/productData";

const FeaturedProducts = () => {
  return (
    <section className="py-8 sm:py-16 px-4 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 text-center">Produits Phares</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {featuredProducts.map(product => (
            <Link 
              key={product.id} 
              to={`/products/${product.title.toLowerCase()}`} 
              className="group"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-64 sm:h-96 object-cover object-center" 
                />
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-medium group-hover:text-accent transition-colors">
                    {product.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
