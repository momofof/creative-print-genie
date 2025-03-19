
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { toJsonValue, parseJsonArray } from "@/utils/jsonUtils";
import { CartItem } from "@/types/product";

interface AddToCartProps {
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export const useCart = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Vérifier si l'utilisateur est connecté et obtenir son ID
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    
    checkAuth();
    
    // Configuration de l'écouteur d'état d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
      } else {
        setUserId(null);
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Charger les articles du panier
  useEffect(() => {
    loadCart();
  }, [userId]);

  const loadCart = async () => {
    setIsLoading(true);
    
    try {
      if (userId) {
        // Récupérer le panier depuis Supabase pour les utilisateurs connectés
        const { data: cartData } = await supabase
          .from('user_carts')
          .select('cart_items')
          .eq('user_id', userId)
          .single();
        
        const parsedItems = parseJsonArray(cartData?.cart_items);
        setCartItems(parsedItems);
      } else {
        // Récupérer le panier depuis localStorage pour les utilisateurs anonymes
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        } else {
          setCartItems([]);
        }
      }
    } catch (error) {
      console.error("Échec du chargement des données du panier:", error);
      toast.error("Impossible de charger votre panier");
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Sauvegarder le panier
  const saveCart = async (updatedCartItems: CartItem[]) => {
    try {
      if (userId) {
        // Convertir les articles du panier en format JSON avant de les envoyer à Supabase
        const jsonSafeCartItems = toJsonValue(updatedCartItems);
        
        // Sauvegarder dans Supabase pour les utilisateurs connectés
        await supabase
          .from('user_carts')
          .upsert({
            user_id: userId,
            cart_items: jsonSafeCartItems
          }, {
            onConflict: 'user_id'
          });
      } else {
        // Sauvegarder dans localStorage pour les utilisateurs anonymes
        localStorage.setItem("cart", JSON.stringify(updatedCartItems));
      }
    } catch (error) {
      console.error("Échec de la sauvegarde du panier:", error);
      toast.error("Impossible de sauvegarder votre panier");
    }
  };

  const addToCart = async ({
    productId,
    productName,
    productPrice,
    quantity,
    selectedColor,
    selectedSize
  }: AddToCartProps) => {
    if (!productId) {
      toast.error("Impossible d'ajouter au panier: ID du produit manquant");
      return;
    }

    setIsLoading(true);
    
    try {
      // Créer l'article pour le panier avec ses variantes
      const variants: Record<string, string> = {};
      if (selectedColor) variants['couleur'] = selectedColor;
      if (selectedSize) variants['taille'] = selectedSize;
      
      const newItem: CartItem = {
        id: productId,
        name: productName,
        price: productPrice,
        quantity: quantity,
        image: "/placeholder.svg", // Image par défaut, pourrait être améliorée
        variants: Object.keys(variants).length > 0 ? variants : undefined
      };
      
      // Copier le panier actuel
      const currentCart = [...cartItems];
      
      // Vérifier si l'article existe déjà dans le panier
      const existingItemIndex = currentCart.findIndex((item) => 
        item.id === productId && 
        JSON.stringify(item.variants || {}) === JSON.stringify(newItem.variants || {})
      );
      
      if (existingItemIndex >= 0) {
        // Mettre à jour la quantité si l'article existe
        currentCart[existingItemIndex].quantity += quantity;
      } else {
        // Ajouter nouvel article
        currentCart.push(newItem);
      }
      
      // Mettre à jour l'état du panier
      setCartItems(currentCart);
      
      // Sauvegarder le panier mis à jour
      await saveCart(currentCart);
      
      toast.success(`${productName} ajouté au panier`);
      return true;
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
      toast.error("Erreur lors de l'ajout au panier");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    saveCart(updatedCart);
    
    toast.success("Quantité mise à jour");
  };

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    saveCart(updatedCart);
    
    toast.success("Produit retiré du panier");
  };

  const clearCart = () => {
    setCartItems([]);
    saveCart([]);
    toast.success("Panier vidé");
  };

  // Calculer le total du panier
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return {
    cartItems,
    isLoading,
    totalPrice,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    loadCart
  };
};
