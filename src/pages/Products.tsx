
import Navigation from "@/components/Navigation";

const Products = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-32 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Notre Catalogue</h1>
          <p className="text-lg text-gray-600">
            Découvrez notre gamme complète de produits personnalisables.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Products;
