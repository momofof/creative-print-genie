
import { useState } from "react";
import { Link } from "react-router-dom";
import { featuredProducts } from "@/data/productData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Filter, ChevronRight } from "lucide-react";

// Extended product type with additional properties
type ExtendedProduct = {
  id: number;
  title: string;
  image: string;
  price?: number;
  rating?: number;
  category?: string;
  bestseller?: boolean;
};

// Mock extended data based on the original featuredProducts
const extendedProducts: ExtendedProduct[] = [
  {
    id: 1,
    title: "T-shirts",
    image: "/lovable-uploads/65ec5eab-d704-46ee-823c-35a148087669.png",
    price: 19.99,
    rating: 4.7,
    category: "textile",
    bestseller: true
  },
  {
    id: 2,
    title: "Sweats",
    image: "/lovable-uploads/5c3e6357-3bff-4033-85a4-fc23513fc793.png",
    price: 29.99,
    rating: 4.5,
    category: "textile"
  },
  {
    id: 3,
    title: "Casquettes",
    image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80",
    price: 14.99,
    rating: 4.2,
    category: "accessoires"
  },
  {
    id: 4,
    title: "Mugs",
    image: "https://images.unsplash.com/photo-1577937127861-20ef40a3df83?auto=format&fit=crop&w=800&q=80",
    price: 12.99,
    rating: 4.8,
    category: "accessoires",
    bestseller: true
  }
];

const FeaturedProducts = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);

  // Apply filters
  const filteredProducts = extendedProducts.filter(product => {
    if (activeFilter && product.category !== activeFilter) return false;
    if (minPrice !== null && (product.price || 0) < minPrice) return false;
    if (maxPrice !== null && (product.price || 0) > maxPrice) return false;
    if (minRating !== null && (product.rating || 0) < minRating) return false;
    return true;
  });

  // Reset all filters
  const resetFilters = () => {
    setActiveFilter(null);
    setMinPrice(null);
    setMaxPrice(null);
    setMinRating(null);
  };

  // Star rating component
  const StarRating = ({ rating }: { rating: number }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={14}
          className={`${
            i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      );
    }
    return <div className="flex">{stars}</div>;
  };

  return (
    <section className="py-8 sm:py-16 px-4 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold">Produits Phares</h2>
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden sm:flex items-center"
            onClick={resetFilters}
          >
            <Filter size={16} className="mr-2" />
            {activeFilter || minPrice || maxPrice || minRating ? "Réinitialiser" : "Filtrer"}
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex flex-wrap gap-3">
            <Button
              variant={activeFilter === null ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(null)}
              className="text-xs"
            >
              Tous
            </Button>
            <Button
              variant={activeFilter === "textile" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("textile")}
              className="text-xs"
            >
              Textile
            </Button>
            <Button
              variant={activeFilter === "accessoires" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("accessoires")}
              className="text-xs"
            >
              Accessoires
            </Button>
          </div>

          <div className="flex flex-wrap gap-6 mt-4">
            <div>
              <label className="text-xs font-medium block mb-2">Prix</label>
              <div className="flex items-center gap-2">
                <select
                  className="text-xs p-1 border rounded"
                  value={minPrice?.toString() || ""}
                  onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="">Min</option>
                  <option value="10">10€</option>
                  <option value="15">15€</option>
                  <option value="20">20€</option>
                </select>
                <span>-</span>
                <select
                  className="text-xs p-1 border rounded"
                  value={maxPrice?.toString() || ""}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="">Max</option>
                  <option value="20">20€</option>
                  <option value="30">30€</option>
                  <option value="50">50€</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium block mb-2">Évaluation</label>
              <select
                className="text-xs p-1 border rounded"
                value={minRating?.toString() || ""}
                onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">Toutes</option>
                <option value="4">4+ étoiles</option>
                <option value="4.5">4.5+ étoiles</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map(product => (
            <Link 
              key={product.id} 
              to={`/customize`} 
              className="group"
            >
              <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="relative">
                  {product.bestseller && (
                    <span className="absolute top-2 left-2 bg-accent text-black text-xs px-2 py-1 rounded font-medium">
                      Bestseller
                    </span>
                  )}
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-64 sm:h-80 object-cover object-center group-hover:scale-105 transition-transform duration-300" 
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium group-hover:text-accent transition-colors">
                        {product.title}
                      </h3>
                      {product.rating && (
                        <div className="flex items-center mt-1">
                          <StarRating rating={product.rating} />
                          <span className="text-xs ml-1 text-gray-500">
                            ({product.rating})
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="font-medium text-accent">
                      {product.price ? `${product.price.toFixed(2)}€` : ""}
                    </span>
                  </div>
                  
                  <Button 
                    className="w-full mt-4 group-hover:bg-accent group-hover:text-black transition-colors"
                    size="sm"
                  >
                    Personnaliser <ChevronRight size={16} className="ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link to="/products">
            <Button variant="outline" className="hover:bg-accent hover:text-black transition-colors">
              Voir tous les produits
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
