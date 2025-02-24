
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";

const productCategories = [
  {
    id: "textile",
    title: "Textile",
    image: "/lovable-uploads/83279871-e720-4ac6-9c14-23e50fecfa8d.png",
    subcategories: ["T-shirts", "Sweats", "Casquettes", "Accessoires textiles"]
  },
  {
    id: "papier",
    title: "Papier",
    image: "/lovable-uploads/83279871-e720-4ac6-9c14-23e50fecfa8d.png",
    subcategories: ["Cartes de visite", "Flyers", "Affiches", "Catalogues"]
  },
  {
    id: "vinyl",
    title: "Vinyl",
    image: "/lovable-uploads/83279871-e720-4ac6-9c14-23e50fecfa8d.png",
    subcategories: ["Autocollants", "Vinyles adhésifs", "Bâches"]
  },
  {
    id: "accessoires",
    title: "Accessoires",
    image: "/lovable-uploads/83279871-e720-4ac6-9c14-23e50fecfa8d.png",
    subcategories: ["Mugs", "Coques téléphone", "Badges", "Porte-clés"]
  },
  {
    id: "panneaux",
    title: "Panneaux publicitaires",
    image: "/lovable-uploads/83279871-e720-4ac6-9c14-23e50fecfa8d.png",
    subcategories: ["Panneaux extérieurs", "Supports rigides", "PLV"]
  },
  {
    id: "enseignes",
    title: "Enseignes publicitaires",
    image: "/lovable-uploads/83279871-e720-4ac6-9c14-23e50fecfa8d.png",
    subcategories: ["Enseignes lumineuses", "Totems", "Lettres découpées"]
  },
  {
    id: "vehicules",
    title: "Véhicules",
    image: "/lovable-uploads/83279871-e720-4ac6-9c14-23e50fecfa8d.png",
    subcategories: ["Covering", "Lettrage", "Stickers", "Magnétiques"]
  },
  {
    id: "ustensiles",
    title: "Ustensiles",
    image: "/lovable-uploads/83279871-e720-4ac6-9c14-23e50fecfa8d.png",
    subcategories: ["Ustensiles de cuisine", "Plateaux", "Dessous de verre", "Sets de table"]
  },
  {
    id: "bijoux",
    title: "Bijoux",
    image: "/lovable-uploads/83279871-e720-4ac6-9c14-23e50fecfa8d.png",
    subcategories: ["Colliers", "Bracelets", "Boucles d'oreilles", "Pendentifs"]
  },
  {
    id: "emballage",
    title: "Emballage",
    image: "/lovable-uploads/83279871-e720-4ac6-9c14-23e50fecfa8d.png",
    subcategories: ["Boîtes personnalisées", "Papier cadeau", "Étiquettes", "Rubans"]
  }
];

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
  return <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 animate-slideUp">
            Créez et Vendez vos Produits Personnalisés
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-slideUp">
            Concevez et vendez des produits personnalisés sans stock. Lancez votre activité d'impression à la demande dès aujourd'hui.
          </p>
          <Link to="/create" className="inline-block bg-accent text-accent-foreground rounded-full text-lg font-medium hover:bg-accent/90 transition-colors animate-slideUp px-[85px] py-[20px] mx-0">
            Commencer à Créer
          </Link>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold mb-8 text-center">Catégories de Produits</h2>
          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {productCategories.map(category => (
              <Link 
                key={category.id} 
                to={`/products/${category.id}`}
                className="group bg-secondary rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square w-full overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-2">
                  <h3 className="text-sm font-medium mb-1 group-hover:text-accent transition-colors">{category.title}</h3>
                  <ul className="space-y-0.5">
                    {category.subcategories.map((subcategory, index) => (
                      <li key={index} className="text-xs text-gray-600">
                        {subcategory}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            ))}
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
