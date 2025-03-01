
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import { useUser } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";

const productCategories = [{
  id: "textile",
  title: "Textile",
  image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80",
  subcategories: ["T-shirts", "Sweats", "Casquettes", "Accessoires textiles"]
}, {
  id: "papier",
  title: "Papier",
  image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
  subcategories: ["Cartes de visite", "Flyers", "Affiches", "Catalogues"]
}, {
  id: "vinyl",
  title: "Vinyl",
  image: "https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&w=800&q=80",
  subcategories: ["Autocollants", "Vinyles adhésifs", "Bâches"]
}, {
  id: "accessoires",
  title: "Accessoires",
  image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=800&q=80",
  subcategories: ["Mugs", "Coques téléphone", "Badges", "Porte-clés"]
}, {
  id: "panneaux",
  title: "Panneaux publicitaires",
  image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&q=80",
  subcategories: ["Panneaux extérieurs", "Supports rigides", "PLV"]
}, {
  id: "enseignes",
  title: "Enseignes publicitaires",
  image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
  subcategories: ["Enseignes lumineuses", "Totems", "Lettres découpées"]
}, {
  id: "vehicules",
  title: "Véhicules",
  image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&q=80",
  subcategories: ["Covering", "Lettrage", "Stickers", "Magnétiques"]
}, {
  id: "ustensiles",
  title: "Ustensiles",
  image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
  subcategories: ["Ustensiles de cuisine", "Plateaux", "Dessous de verre", "Sets de table"]
}, {
  id: "bijoux",
  title: "Bijoux",
  image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
  subcategories: ["Colliers", "Bracelets", "Boucles d'oreilles", "Pendentifs"]
}, {
  id: "emballage",
  title: "Emballage",
  image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=800&q=80",
  subcategories: ["Boîtes personnalisées", "Papier cadeau", "Étiquettes", "Rubans"]
}];

const featuredProducts = [{
  id: 1,
  title: "T-shirts",
  image: "/lovable-uploads/65ec5eab-d704-46ee-823c-35a148087669.png"
}, {
  id: 2,
  title: "Sweats",
  image: "/lovable-uploads/5c3e6357-3bff-4033-85a4-fc23513fc793.png"
}];

const Index = () => {
  const user = useUser();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement
    const checkUserSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    
    checkUserSession();
    
    // Écouter les changements d'état d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return <div className="min-h-screen bg-white">
      {/* Promotional Banner */}
      {showBanner && (
        <div className="bg-[#ff3c5a] text-white py-3 px-4 text-center relative">
          <div className="max-w-7xl mx-auto flex justify-center items-center">
            <p className="text-sm font-medium">
              10% off everything <Link to="/promo" className="underline font-bold ml-2">Redeem Code Now</Link>
            </p>
            <button 
              onClick={() => setShowBanner(false)}
              className="absolute right-4 text-white hover:text-gray-200"
              aria-label="Close banner"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 py-[12px]">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 animate-slideUp">
            Créez et Vendez vos Produits Personnalisés
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-slideUp">
            Concevez et vendez des produits personnalisés sans stock. Lancez votre activité d'impression à la demande dès aujourd'hui.
          </p>
          <div className="space-y-4 animate-slideUp">
            <Link to="/create" className="inline-block bg-accent text-accent-foreground rounded-full text-lg font-medium hover:bg-accent/90 transition-colors mx-0 px-[61px] py-[19px]">
              Commencer à Créer
            </Link>
            {!isLoggedIn && (
              <div className="mt-6">
                <div className="text-gray-600">
                  Vous avez déjà un compte ? {" "}
                  <Link to="/login" className="text-accent hover:underline">
                    Se connecter
                  </Link>
                  {" "} ou {" "}
                  <Link to="/signup" className="text-accent hover:underline">
                    Créer un compte
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="px-4 bg-white py-[35px]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold mb-8 text-center">Catégories de Produits</h2>
          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {productCategories.map(category => <Link key={category.id} to={`/products/${category.id}`} className="group bg-secondary rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square w-full overflow-hidden">
                  <img src={category.image} alt={category.title} className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-2">
                  <h3 className="text-sm font-medium mb-1 group-hover:text-accent transition-colors">{category.title}</h3>
                  <ul className="space-y-0.5">
                    {category.subcategories.map((subcategory, index) => <li key={index} className="text-xs text-gray-600">
                        {subcategory}
                      </li>)}
                  </ul>
                </div>
              </Link>)}
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-16 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold mb-8 text-center">Produits Phares</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProducts.map(product => <Link key={product.id} to={`/products/${product.title.toLowerCase()}`} className="group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                  <img src={product.image} alt={product.title} className="w-full h-96 object-cover object-center" />
                  <div className="p-6">
                    <h3 className="text-xl font-medium group-hover:text-accent transition-colors">
                      {product.title}
                    </h3>
                  </div>
                </div>
              </Link>)}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold mb-12 text-center">Pourquoi Nous Choisir</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{
            title: "Aucun Stock Requis",
            description: "Les produits sont imprimés et expédiés uniquement à la commande."
          }, {
            title: "Produits de Qualité",
            description: "Partenariat avec des fabricants premium pour une qualité optimale."
          }, {
            title: "Facile à Utiliser",
            description: "Des outils de conception simples pour donner vie à vos idées."
          }].map((feature, index) => <div key={index} className="p-6 rounded-2xl bg-white border border-gray-100 hover:border-accent transition-colors">
                <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>)}
          </div>
        </div>
      </section>
    </div>;
};

export default Index;
