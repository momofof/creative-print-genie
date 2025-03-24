
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Dot } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  subcategory: string;
  // Optional fields to fix TypeScript errors
  description?: string;
  color?: string;
  date?: string;
}

interface ProductListProps {
  products?: Product[];
  layout?: 'grid' | 'list';
  responsive?: boolean;
  categoryId?: string;
  subcategoryId?: string;
}

const ProductList = ({ products, layout = 'grid', responsive = true }: ProductListProps) => {
  // Utiliser les données de produits fournies ou les récupérer à partir de allProducts
  const productsToDisplay = products || [];
  
  if (productsToDisplay.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Aucun produit trouvé</p>
      </div>
    );
  }

  if (layout === 'list') {
    return (
      <div className="space-y-4">
        {productsToDisplay.map(product => (
          <Link key={product.id} to={`/products/detail/${product.id}`}>
            <div className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-24 h-24 object-cover rounded-md"
              />
              <div className="flex-1">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="font-semibold">{product.price} €</span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-gray-500 line-through">{product.originalPrice} €</span>
                  )}
                  {product.color && (
                    <div className="flex items-center text-gray-500 text-sm">
                      <Dot className="h-4 w-4" />
                      <span>{product.color}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className={`${responsive ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid grid-cols-4'} gap-4`}>
      {productsToDisplay.map(product => (
        <Link key={product.id} to={`/products/detail/${product.id}`}>
          <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-medium">{product.name}</h3>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-semibold">{product.price} €</span>
                {product.date && (
                  <Badge variant="outline" className="text-xs">
                    {formatDistanceToNow(new Date(product.date), { addSuffix: true, locale: fr })}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductList;
