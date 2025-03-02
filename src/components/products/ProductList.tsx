
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Données simulées de produits pour démonstration
const demoProducts = [
  {
    id: "tshirt-coton-bio",
    name: "T-shirt manches longues Premium Homme",
    price: 16.99,
    originalPrice: 19.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.5,
    reviewCount: 75,
    category: "textile",
    subcategory: "t-shirts"
  },
  {
    id: "sweatshirt-premium",
    name: "Sweatshirt Premium Bio Unisexe",
    price: 29.99,
    originalPrice: 34.99,
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.8,
    reviewCount: 43,
    category: "textile",
    subcategory: "sweats"
  },
  {
    id: "pull-capuche",
    name: "Pull à Capuche Heavy Blend",
    price: 34.99,
    originalPrice: 39.99,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.6,
    reviewCount: 28,
    category: "textile",
    subcategory: "sweats"
  },
  {
    id: "affiche-a3",
    name: "Affiche A3 Haute Qualité",
    price: 9.99,
    originalPrice: 12.99,
    image: "https://images.unsplash.com/photo-1561839561-b13bcfe95249?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.3,
    reviewCount: 52,
    category: "papier",
    subcategory: "affiches"
  },
  {
    id: "flyer-a5",
    name: "Flyers A5 Recto/Verso",
    price: 7.99,
    originalPrice: 9.99,
    image: "https://images.unsplash.com/photo-1524321091096-90ce089fe010?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.2,
    reviewCount: 37,
    category: "papier",
    subcategory: "flyers"
  },
  {
    id: "carte-visite",
    name: "Cartes de Visite Premium",
    price: 14.99,
    originalPrice: 17.99,
    image: "https://images.unsplash.com/photo-1634898253857-618fd2a5b5eb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.7,
    reviewCount: 68,
    category: "papier",
    subcategory: "cartes-de-visite"
  }
];

interface ProductListProps {
  categoryId?: string;
  subcategoryId?: string;
}

const ProductList = ({ categoryId, subcategoryId }: ProductListProps) => {
  // Filtrer les produits en fonction de la catégorie et sous-catégorie
  const filteredProducts = demoProducts.filter(product => {
    if (categoryId && product.category !== categoryId) return false;
    if (subcategoryId && product.subcategory !== subcategoryId.replace(/-/g, ' ')) return false;
    return true;
  });

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Aucun produit trouvé dans cette catégorie.</p>
        <Link to="/products">
          <Button variant="outline" className="mt-4">Voir toutes les catégories</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Link 
            key={product.id} 
            to={`/products/detail/${product.id}`}
            className="group"
          >
            <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" 
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 group-hover:text-accent transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center mt-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-current" : "fill-gray-300"}`} 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-1 text-xs text-gray-500">({product.reviewCount})</span>
                </div>
                <div className="mt-2 flex items-center">
                  <span className="text-accent font-bold">{product.price.toFixed(2)} €</span>
                  {product.originalPrice && (
                    <>
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        {product.originalPrice.toFixed(2)} €
                      </span>
                      <span className="ml-2 text-xs font-medium text-green-600">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
