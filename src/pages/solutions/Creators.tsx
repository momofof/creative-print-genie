
import Navigation from "@/components/Navigation";

const Creators = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-32 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Solutions pour créateurs</h1>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 border rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">
                Donnez vie à vos créations
              </h2>
              <p className="text-gray-600">
                Transformez vos designs en produits de qualité sans stock ni investissement initial.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">
                Gestion simplifiée
              </h2>
              <p className="text-gray-600">
                Concentrez-vous sur votre créativité, nous gérons la production et la logistique.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Creators;
