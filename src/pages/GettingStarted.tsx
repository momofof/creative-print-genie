
import Navigation from "@/components/Navigation";

const GettingStarted = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-32 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Guide de démarrage</h1>
          <div className="space-y-8">
            <section className="border-b pb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Créez votre compte</h2>
              <p className="text-gray-600">
                Commencez par créer votre compte PrintGenie gratuitement.
              </p>
            </section>
            <section className="border-b pb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Uploadez vos designs</h2>
              <p className="text-gray-600">
                Téléchargez vos créations et choisissez vos produits.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Commencez à vendre</h2>
              <p className="text-gray-600">
                Partagez vos produits et nous nous occupons du reste.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;
