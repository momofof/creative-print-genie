
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { allProducts } from "@/data/productData";

interface ProductListProps {
  categoryId?: string;
  subcategoryId?: string;
}

const ProductList = ({ categoryId, subcategoryId }: ProductListProps) => {
  // Filtrer les produits en fonction de la catégorie et sous-catégorie
  const filteredProducts = allProducts.filter(product => {
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
