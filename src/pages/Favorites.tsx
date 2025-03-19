
import React from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "@/hooks/useFavorites";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";

const Favorites = () => {
  const navigate = useNavigate();
  const { favorites, isLoading, removeFromFavorites } = useFavorites();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-32 pb-16 px-4 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Heart className="text-pink-500" /> Mes produits favoris
          </h1>
          <p className="text-gray-600 mt-2">
            Retrouvez tous les produits que vous avez ajoutés à vos favoris
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <div key={favorite.id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                <div 
                  className="h-48 bg-gray-100 relative cursor-pointer"
                  onClick={() => navigate(`/products/detail/${favorite.product_id}`)}
                >
                  {favorite.product_image ? (
                    <img 
                      src={favorite.product_image} 
                      alt={favorite.product_name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-200">
                      <ShoppingBag className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 
                    className="font-medium text-lg mb-1 cursor-pointer hover:text-accent transition-colors"
                    onClick={() => navigate(`/products/detail/${favorite.product_id}`)}
                  >
                    {favorite.product_name || "Produit sans nom"}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">{favorite.product_category || "Catégorie non spécifiée"}</p>
                  <p className="text-accent font-medium mb-4">{favorite.product_price?.toFixed(2) || "0.00"} €</p>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="default" 
                      className="flex-1"
                      onClick={() => navigate(`/products/detail/${favorite.product_id}`)}
                    >
                      Voir le détail
                    </Button>
                    <Button 
                      variant="outline" 
                      className="p-2 aspect-square"
                      onClick={() => removeFromFavorites(favorite.product_id)}
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-medium text-gray-700 mb-2">Aucun favori</h2>
            <p className="text-gray-500 mb-6">Vous n'avez pas encore ajouté de produits à vos favoris</p>
            <Button onClick={() => navigate('/products')}>
              Découvrir nos produits
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Favorites;
