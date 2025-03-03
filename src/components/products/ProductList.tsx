
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProductListProps {
  products: any[];
  categoryId?: string;
  subcategoryId?: string;
  viewMode?: "grid" | "list";
}

const ProductList = ({ products, categoryId, subcategoryId, viewMode = "grid" }: ProductListProps) => {
  const [databaseProducts, setDatabaseProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (products && products.length > 0) {
      // Use the passed products if available
      return;
    }
    
    fetchProducts();
  }, [categoryId, subcategoryId]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('status', 'published');
      
      if (categoryId) {
        query = query.eq('category', categoryId);
      }
      
      if (subcategoryId) {
        query = query.eq('subcategory', subcategoryId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      setDatabaseProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Impossible de charger les produits");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-gray-100 animate-pulse rounded-lg h-80"></div>
        ))}
      </div>
    );
  }

  // Choose which products to display
  const displayProducts = products.length > 0 ? products : databaseProducts;

  // Show empty state if no products
  if (displayProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Aucun produit trouvé</h3>
        <p className="mt-2 text-gray-500">
          Essayez de modifier vos filtres ou revenez plus tard.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {displayProducts.map((product) => (
        <ProductCard 
          key={product.id}
          product={{
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.original_price,
            image: product.image,
            rating: product.rating || 0,
            reviewCount: product.reviewCount || 0,
            category: product.category,
            subcategory: product.subcategory,
            description: product.description,
            isNew: new Date(product.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
          }}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
};

export default ProductList;
