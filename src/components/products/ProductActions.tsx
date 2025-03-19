
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ProductActionsProps {
  productId?: string;
  productName?: string;
  productPrice?: number;
  selectedColor?: string;
  selectedSize?: string;
  quantity?: number;
}

const ProductActions = ({ 
  productId, 
  productName = "Produit",
  productPrice = 0,
  selectedColor,
  selectedSize,
  quantity = 1
}: ProductActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!productId) {
      toast.error("Impossible d'ajouter au panier: ID du produit manquant");
      return;
    }

    setIsLoading(true);
    
    try {
      // Get existing cart from localStorage
      const existingCartJson = localStorage.getItem("cart");
      const existingCart = existingCartJson ? JSON.parse(existingCartJson) : [];
      
      // Create new cart item
      const newItem = {
        id: productId,
        name: productName,
        price: productPrice,
        quantity: quantity,
        image: "/placeholder.svg", // Default image, could be passed as a prop
        color: selectedColor,
        size: selectedSize
      };
      
      // Check if item already exists in cart
      const existingItemIndex = existingCart.findIndex((item: any) => 
        item.id === productId && item.color === selectedColor && item.size === selectedSize
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        existingCart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item if it doesn't exist
        existingCart.push(newItem);
      }
      
      // Save updated cart to localStorage
      localStorage.setItem("cart", JSON.stringify(existingCart));
      
      // If user is logged in, save cart to Supabase as well
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Save to user_carts table in Supabase
        const { error } = await supabase
          .from('user_carts')
          .upsert({
            user_id: user.id,
            cart_items: existingCart
          }, {
            onConflict: 'user_id'
          });
          
        if (error) {
          console.error("Error saving cart to Supabase:", error);
        }
      }
      
      toast.success(`${productName} ajouté au panier`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Erreur lors de l'ajout au panier");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToFavorites = async () => {
    if (!productId) {
      toast.error("Impossible d'ajouter aux favoris: ID du produit manquant");
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Add to favorites in Supabase
        const { error } = await supabase.from('likes')
          .insert({
            user_id: user.id,
            product_id: productId
          });
          
        if (error) {
          // Check if it's a duplicate (product already in favorites)
          if (error.code === '23505') {
            toast.info("Ce produit est déjà dans vos favoris");
          } else {
            throw error;
          }
        } else {
          toast.success("Produit ajouté aux favoris");
        }
      } else {
        // Prompt to login if not authenticated
        toast.info("Veuillez vous connecter pour ajouter aux favoris");
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
      toast.error("Erreur lors de l'ajout aux favoris");
    }
  };
  
  return (
    <div className="flex flex-col space-y-3 mb-6">
      <Button 
        className="w-full py-6 text-base font-medium flex items-center gap-2 bg-accent hover:bg-accent/90"
        onClick={handleAddToCart}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Ajout en cours...
          </span>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            Ajouter au panier
          </>
        )}
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full py-6 text-base font-medium flex items-center justify-center gap-2"
        onClick={handleAddToFavorites}
      >
        <Heart className="w-5 h-5" />
        Ajouter aux favoris
      </Button>
      
      <Link to={`/customize/${productId || ''}`}>
        <Button 
          className="w-full py-6 text-base font-medium bg-teal-600 hover:bg-teal-700"
        >
          Personnaliser
        </Button>
      </Link>
    </div>
  );
};

export default ProductActions;
