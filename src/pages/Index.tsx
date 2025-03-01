
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
              10% de réduction sur tout <Link to="/promo" className="underline font-bold ml-2">Utilisez le code maintenant</Link>
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
      
      {/* Full-width Hero Banner with Overlay Text */}
      <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] w-full">
        {/* Full-width background image */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1626947346165-4c2288dadc2a?auto=format&fit=crop&w=2000&q=80" 
            alt="Person wearing customized apparel" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 md:bg-opacity-40"></div>
        </div>
        
        {/* Overlay text and buttons */}
        <div className="relative z-10 h-full flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-white space-y-4 sm:space-y-6 max-w-xl">
            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-lg sm:text-xl font-medium">Vos Idées, Votre Style</h2>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">VOTRE CRÉATION</h1>
            </div>
            <p className="text-base sm:text-lg max-w-md">
              Donnez vie à vos designs sur une variété de produits de qualité. Imprimez à la demande sans stock minimum.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4 pt-4">
              <Link to="/create" className="bg-white text-gray-900 hover:bg-gray-100 px-4 sm:px-6 py-2 sm:py-3 rounded font-medium shadow-sm transition-colors text-sm sm:text-base">
                Créer Maintenant
              </Link>
              <Link to="/products" className="bg-black text-white hover:bg-gray-800 border border-white px-4 sm:px-6 py-2 sm:py-3 rounded font-medium shadow-sm transition-colors text-sm sm:text-base">
                Acheter Maintenant
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Category Pills - Now in a separate section below the hero */}
      <section className="bg-white py-4 sm:py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-start sm:justify-center gap-2 sm:gap-3 pb-2 sm:pb-0 overflow-x-auto scrollbar-none whitespace-nowrap">
            {["T-shirts", "Sweats & Hoodies", "Broderie", "Accessoires", "Articles pour Bébé", "Mugs", "Casquettes"].map((category) => (
              <Link 
                key={category} 
                to={`/products/${category.toLowerCase().replace(" & ", "-")}`}
                className="whitespace-nowrap bg-gray-100 border border-gray-200 rounded-full px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium hover:bg-gray-200 transition-colors flex-shrink-0"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="px-4 bg-white py-6 sm:py-[35px]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 text-center">Catégories de Produits</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {productCategories.map(category => <Link key={category.id} to={`/products/${category.id}`} className="group bg-secondary rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square w-full overflow-hidden">
                  <img src={category.image} alt={category.title} className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-2">
                  <h3 className="text-xs sm:text-sm font-medium mb-1 group-hover:text-accent transition-colors">{category.title}</h3>
                  <ul className="space-y-0.5 hidden sm:block">
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
      <section className="py-8 sm:py-16 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 text-center">Produits Phares</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {featuredProducts.map(product => <Link key={product.id} to={`/products/${product.title.toLowerCase()}`} className="group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                  <img src={product.image} alt={product.title} className="w-full h-64 sm:h-96 object-cover object-center" />
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-medium group-hover:text-accent transition-colors">
                      {product.title}
                    </h3>
                  </div>
                </div>
              </Link>)}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-8 sm:mb-12 text-center">Pourquoi Nous Choisir</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[{
            title: "Aucun Stock Requis",
            description: "Les produits sont imprimés et expédiés uniquement à la commande."
          }, {
            title: "Produits de Qualité",
            description: "Partenariat avec des fabricants premium pour une qualité optimale."
          }, {
            title: "Facile à Utiliser",
            description: "Des outils de conception simples pour donner vie à vos idées."
          }].map((feature, index) => <div key={index} className="p-4 sm:p-6 rounded-2xl bg-white border border-gray-100 hover:border-accent transition-colors">
                <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
              </div>)}
          </div>
        </div>
      </section>
    </div>;
};

export default Index;
