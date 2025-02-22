
import Navigation from "@/components/Navigation";

const TechnicalSupport = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-32 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Support technique</h1>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">
                Une assistance dédiée
              </h2>
              <p className="text-gray-600">
                Notre équipe technique est là pour vous aider à résoudre tous vos problèmes
                et optimiser votre utilisation de PrintGenie.
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Support par email</h3>
                  <p className="text-gray-600">Réponse sous 24h ouvrées</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Chat en direct</h3>
                  <p className="text-gray-600">Du lundi au vendredi, 9h-18h</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Centre d'aide</h3>
              <p className="text-gray-600 mb-4">
                Consultez notre base de connaissances pour des réponses rapides
                à vos questions.
              </p>
              <button className="bg-accent text-accent-foreground px-6 py-2 rounded-md hover:bg-accent/90">
                Accéder au centre d'aide
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalSupport;
