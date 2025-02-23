
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";

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
