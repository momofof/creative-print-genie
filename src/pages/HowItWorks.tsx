
import Navigation from "@/components/Navigation";

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-32 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Comment ça marche</h1>
          <p className="text-lg text-gray-600 mb-8">
            Découvrez comment PrintGenie simplifie l'impression à la demande pour vous.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 border rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Notre processus</h2>
              <p className="text-gray-600">
                De la création à la livraison, nous nous occupons de tout pour vous
                permettre de vous concentrer sur votre créativité.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Nos garanties</h2>
              <p className="text-gray-600">
                Qualité premium, délais respectés et satisfaction client garantie.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
