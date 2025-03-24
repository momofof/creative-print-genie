
import React from "react";
import Navigation from "@/components/Navigation";
import { useProductsWithVariants } from "@/hooks/useProductsWithVariants";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductList from "@/components/products/ProductList";

export default function Home() {
  const { products, isLoading, error, refetch } = useProductsWithVariants();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-br from-teal-500 to-teal-700 text-white">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Vos produits personnalisés</h1>
          <p className="text-lg md:text-xl mb-8">
            Découvrez notre sélection de produits de haute qualité, personnalisables selon vos besoins
          </p>
          <Button className="px-8 py-6 bg-white text-teal-700 hover:bg-gray-100">
            Commander maintenant
          </Button>
        </div>
      </div>

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
