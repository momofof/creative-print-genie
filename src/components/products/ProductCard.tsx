
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Search } from "lucide-react";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  viewMode: "grid" | "list";
}

const ProductCard = ({ product, viewMode }: ProductCardProps) => {
  // Convert potential string prices to numbers
  const price = typeof product.price === 'number' ? product.price : parseFloat(String(product.price));
  const originalPrice = product.originalPrice 
    ? (typeof product.originalPrice === 'number' ? product.originalPrice : parseFloat(String(product.originalPrice))) 
    : null;

  return (
    <div className="group relative">
      <div className={`border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow ${
        viewMode === "list" ? "flex items-start" : ""
      }`}>
        {/* Product image */}
        <Link 
          to={`/products/detail/${product.id}`}
          className={`block overflow-hidden ${viewMode === "list" ? "w-40 shrink-0" : "aspect-square"}`}
        >
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" 
          />
        </Link>
        
        {/* Product information */}
        <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
          <Link to={`/products/detail/${product.id}`}>
            <h3 className="font-medium text-gray-900 group-hover:text-accent transition-colors">
              {product.name}
            </h3>
          </Link>
          
          {/* Rating and reviews */}
          <div className="flex items-center mt-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? "fill-current" : "fill-gray-300"}`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <span className="ml-1 text-xs text-gray-500">({product.reviewCount || 0})</span>
          </div>
          
          {/* Price */}
          <div className="mt-2 flex items-center">
            <span className="text-accent font-bold">{formatPrice(price)}</span>
            {originalPrice && originalPrice > price && (
              <>
                <span className="ml-2 text-sm text-gray-500 line-through">
                  {formatPrice(originalPrice)}
                </span>
                <span className="ml-2 text-xs font-medium text-green-600">
                  -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
                </span>
              </>
            )}
          </div>
          
          {/* Short description for list view */}
          {viewMode === "list" && product.description && (
            <p className="mt-2 text-sm text-gray-500 line-clamp-2">{product.description}</p>
          )}
          
          {/* Quick actions */}
          <div className={`mt-3 flex items-center gap-2 ${viewMode === "list" ? "" : "opacity-0 group-hover:opacity-100 transition-opacity"}`}>
            <button className="p-1.5 rounded-full bg-accent/10 hover:bg-accent/20 text-accent" title="Ajouter au panier">
              <ShoppingCart className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700" title="Ajouter aux favoris">
              <Heart className="w-4 h-4" />
            </button>
            <Link to={`/products/detail/${product.id}`} className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700" title="Voir détails">
              <Search className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Badge for new or promo */}
      {product.isNew && (
        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
          Nouveau
        </div>
      )}
      {originalPrice && originalPrice > price && (
        <div className="absolute top-2 right-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded">
          Promo
        </div>
      )}
    </div>
  );
};

export default ProductCard;
