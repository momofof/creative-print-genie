import { useState, useEffect } from "react";
import { MinusCircle, PlusCircle, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { toast } from "sonner";
import { CartItem } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";
import { parseJsonArray, toJsonValue } from "@/utils/jsonUtils";

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Check if user is logged in and get user ID
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    
    checkAuth();
    
    // Set up auth state listener
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

  // Load cart items (from Supabase for logged in users, otherwise from localStorage)
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      
      try {
        if (userId) {
          // Get cart from Supabase for logged in users
          const { data: cartData } = await supabase
            .from('user_carts')
            .select('cart_items')
            .eq('user_id', userId)
            .single();
          
          const parsedItems = parseJsonArray(cartData?.cart_items);
          setCartItems(parsedItems);
        } else {
          // Get cart from localStorage for anonymous users
          const savedCart = localStorage.getItem("cart");
          if (savedCart) {
            setCartItems(JSON.parse(savedCart));
          } else {
            setCartItems([]);
          }
        }
      } catch (error) {
        console.error("Failed to load cart data:", error);
        toast.error("Impossible de charger votre panier");
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCart();
  }, [userId]);

  // Save cart whenever it changes
  useEffect(() => {
    if (isLoading) return;
    
    const saveCart = async () => {
      try {
        if (userId) {
          // Convert cartItems to JSON-safe format before sending to Supabase
          const jsonSafeCartItems = toJsonValue(cartItems);
          
          // Save to Supabase for logged in users
          await supabase
            .from('user_carts')
            .upsert({
              user_id: userId,
              cart_items: jsonSafeCartItems
            }, {
              onConflict: 'user_id'
            });
        } else {
          // Save to localStorage for anonymous users
          localStorage.setItem("cart", JSON.stringify(cartItems));
        }
      } catch (error) {
        console.error("Failed to save cart:", error);
        toast.error("Impossible de sauvegarder votre panier");
      }
    };
    
    saveCart();
  }, [cartItems, userId, isLoading]);

  // Calculate total price of all items in cart
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Update quantity of an item in the cart
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
    
    toast.success("Quantité mise à jour");
  };

  // Remove an item from the cart
  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    toast.success("Produit retiré du panier");
  };

  // Clear the entire cart
  const clearCart = () => {
    setCartItems([]);
    toast.success("Panier vidé");
  };

  return (
    <>
      <Navigation />
      <main className="container mx-auto px-4 py-24 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Votre Panier</h1>
        
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-medium mb-4">Votre panier est vide</h2>
            <p className="text-gray-600 mb-8">Parcourez notre catalogue pour trouver des produits à ajouter à votre panier</p>
            <Link to="/" className="bg-accent text-white px-6 py-3 rounded-md font-medium hover:bg-accent/90 inline-block">
              Voir le catalogue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium">Articles ({cartItems.length})</h2>
                    <button
                      onClick={clearCart}
                      className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      <span>Vider le panier</span>
                    </button>
                  </div>
                </div>
                
                <div className="divide-y">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-4 flex flex-col sm:flex-row gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-accent font-medium mt-1">
                          {item.price.toLocaleString('fr-FR')} €
                        </p>
                        
                        {item.variants && Object.keys(item.variants).length > 0 && (
                          <div className="mt-1 text-sm text-gray-500">
                            {Object.entries(item.variants).map(([key, value]) => (
                              <span key={key} className="mr-3">
                                {key}: {value}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center mt-2 space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-gray-500 hover:text-accent"
                            aria-label="Diminuer la quantité"
                          >
                            <MinusCircle size={20} />
                          </button>
                          <span className="px-2 py-1 border rounded-md min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-gray-500 hover:text-accent"
                            aria-label="Augmenter la quantité"
                          >
                            <PlusCircle size={20} />
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-auto text-red-600 hover:text-red-800"
                            aria-label="Supprimer du panier"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4 sticky top-24">
                <h2 className="text-lg font-medium mb-4">Récapitulatif</h2>
                
                <div className="space-y-2">
                  <div className="flex justify-between pb-2">
                    <span>Sous-total</span>
                    <span>{totalPrice.toLocaleString('fr-FR')} €</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span>Livraison</span>
                    <span>Calculé à l'étape suivante</span>
                  </div>
                  <div className="border-t pt-2 font-medium text-lg flex justify-between">
                    <span>Total</span>
                    <span>{totalPrice.toLocaleString('fr-FR')} €</span>
                  </div>
                </div>
                
                <button
                  className="w-full bg-accent text-white py-3 rounded-md font-medium mt-6 hover:bg-accent/90"
                  onClick={() => toast.success("Fonctionnalité de commande à venir !")}
                >
                  Passer à la caisse
                </button>
                
                <Link
                  to="/"
                  className="w-full block text-center border border-gray-300 text-gray-700 py-3 rounded-md font-medium mt-3 hover:bg-gray-50"
                >
                  Continuer vos achats
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Cart;
