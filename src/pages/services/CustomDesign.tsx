
import Navigation from "@/components/Navigation";

const CustomDesign = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-32 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Design personnalisé</h1>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">
                Service de design sur mesure
              </h2>
              <p className="text-gray-600">
                Nos designers professionnels donnent vie à vos idées avec des créations uniques
                et adaptées à vos besoins.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  ✓ Designs originaux
                </li>
                <li className="flex items-center text-gray-700">
                  ✓ Révisions illimitées
                </li>
                <li className="flex items-center text-gray-700">
                  ✓ Formats optimisés pour l'impression
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Commencer un projet</h3>
              <p className="text-gray-600 mb-4">
                Contactez-nous pour discuter de votre projet de design personnalisé.
              </p>
              <button className="bg-accent text-accent-foreground px-6 py-2 rounded-md hover:bg-accent/90">
                Demander un devis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomDesign;
