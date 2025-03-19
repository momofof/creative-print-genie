
import React from "react";
import { Link } from "react-router-dom";
import { productCategories } from "@/data/productData";
import { Card, CardContent } from "@/components/ui/card";
import { Shirt, BookImage, Tv, Umbrella, UtensilsCrossed, Camera } from "lucide-react";

const ProductCatalog = () => {
  // Map pour associer chaque catégorie à son icône
  const categoryIcons: Record<string, React.ReactNode> = {
    textile: <Shirt className="h-6 w-6" />,
    papier: <BookImage className="h-6 w-6" />,
    vinyl: <Tv className="h-6 w-6" />,
    accessoires: <Umbrella className="h-6 w-6" />,
    ustensiles: <UtensilsCrossed className="h-6 w-6" />,
    bijoux: <Camera className="h-6 w-6" />,
    // Pour les autres catégories, on utilise un icône par défaut
    default: <Shirt className="h-6 w-6" />
  };

  // Fonction pour obtenir l'icône en fonction de l'id de la catégorie
  const getCategoryIcon = (categoryId: string) => {
    return categoryIcons[categoryId] || categoryIcons.default;
  };

  return (
    <div className="bg-white">
      {/* Titre principal */}
      <section className="py-10">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold mb-2">Nos Produits</h1>
          <p className="text-xl text-gray-600">Sélectionnez une catégorie</p>
        </div>
      </section>

      {/* Affichage simplifié des catégories */}
      <section className="py-8 mb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {productCategories.map((category) => (
              <Link 
                key={category.id}
                to={`/products/${category.id}`}
                className="group"
              >
                <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-square w-full relative overflow-hidden">
                    <img 
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <div className="mb-2 text-teal-600">
                      {getCategoryIcon(category.id)}
                    </div>
                    <h3 className="text-sm font-medium text-center">{category.title}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductCatalog;
