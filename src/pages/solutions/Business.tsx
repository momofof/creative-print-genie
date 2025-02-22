
import Navigation from "@/components/Navigation";

const Business = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-32 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Solutions pour entreprises</h1>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 border rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">
                Merchandising personnalisé
              </h2>
              <p className="text-gray-600">
                Créez des produits à votre image pour vos événements et votre communication.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">
                Solutions B2B
              </h2>
              <p className="text-gray-600">
                API dédiée et intégration sur mesure pour vos besoins spécifiques.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Business;
