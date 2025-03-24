
import React from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/home/Hero";
import ProductList from "@/components/products/ProductList";
import Footer from "@/components/Footer";
import { useProductsWithVariants } from "@/hooks/useProductsWithVariants";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { products, isLoading, error, refetch } = useProductsWithVariants();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Nos Produits</h2>
          <p className="text-gray-600">Découvrez notre gamme complète de produits personnalisables</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500 mb-4">Erreur lors du chargement des produits</p>
            <Button onClick={() => refetch()}>Réessayer</Button>
          </div>
        ) : (
          <ProductList products={products} showVariants={true} />
        )}
      </div>

      <Footer />
    </div>
  );
}
