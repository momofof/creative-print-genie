
import Navigation from "@/components/Navigation";

const Tutorials = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-32 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Tutoriels</h1>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border rounded-lg overflow-hidden">
              <div className="aspect-video bg-gray-100"></div>
              <div className="p-4">
                <h2 className="font-semibold mb-2">Débuter avec PrintGenie</h2>
                <p className="text-gray-600">
                  Apprenez les bases de la création de produits.
                </p>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <div className="aspect-video bg-gray-100"></div>
              <div className="p-4">
                <h2 className="font-semibold mb-2">Optimiser vos designs</h2>
                <p className="text-gray-600">
                  Conseils pour des impressions de qualité.
                </p>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <div className="aspect-video bg-gray-100"></div>
              <div className="p-4">
                <h2 className="font-semibold mb-2">Marketing pour créateurs</h2>
                <p className="text-gray-600">
                  Stratégies pour vendre vos produits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutorials;
