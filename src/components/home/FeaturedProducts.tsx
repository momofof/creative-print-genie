
import { Link } from "react-router-dom";
import { featuredProducts } from "@/data/productData";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const FeaturedProducts = () => {
  return (
    <section className="py-8 sm:py-16 px-4 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 text-center">Produits Phares</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {featuredProducts.map(product => (
            <Link 
              key={product.id} 
              to={`/products/detail/${product.id}`} 
              className="group"
            >
              <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-64 sm:h-96 object-cover object-center" 
                  />
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-sm font-medium text-accent">
                    Bestseller
                  </div>
                </div>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">(42)</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-medium group-hover:text-accent transition-colors mb-1">
                    {product.title}
                  </h3>
                  <p className="text-accent font-medium">16,99 €</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
