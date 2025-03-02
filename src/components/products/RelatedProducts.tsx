
import React from "react";
import { Link } from "react-router-dom";

interface RelatedProduct {
  id: number;
  name: string;
  price: string;
  image: string;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

const RelatedProducts = ({ products }: RelatedProductsProps) => {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Vous pourriez aussi aimer</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link key={product.id} to={`/products/detail/${product.id}`} className="group">
            <div className="bg-gray-50 rounded-lg overflow-hidden aspect-square mb-3">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
              />
            </div>
            <h3 className="font-medium text-gray-900 group-hover:text-accent transition-colors">{product.name}</h3>
            <p className="text-accent">{product.price} €</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
