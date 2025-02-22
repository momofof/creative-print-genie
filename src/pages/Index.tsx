
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";

const featuredProducts = [
  {
    id: 1,
    title: "T-shirts",
    image: "/lovable-uploads/65ec5eab-d704-46ee-823c-35a148087669.png",
  },
  {
    id: 2,
    title: "Hoodies",
    image: "/lovable-uploads/5c3e6357-3bff-4033-85a4-fc23513fc793.png",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 animate-slideUp">
            Create and Sell Custom Products
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-slideUp">
            Design and sell custom products without inventory. Start your print-on-demand business today.
          </p>
          <Link
            to="/create"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-full text-lg font-medium hover:bg-primary/90 transition-colors animate-slideUp"
          >
            Start Creating
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold mb-8 text-center">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.title.toLowerCase()}`}
                className="group"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-96 object-cover object-center"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-medium group-hover:text-accent transition-colors">
                      {product.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold mb-12 text-center">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "No Inventory Required",
                description: "Products are printed and shipped only when ordered.",
              },
              {
                title: "Quality Products",
                description: "Partner with premium manufacturers for the best quality.",
              },
              {
                title: "Easy to Use",
                description: "Simple design tools to bring your ideas to life.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white border border-gray-100 hover:border-accent transition-colors"
              >
                <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
