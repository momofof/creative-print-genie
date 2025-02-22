
import Navigation from "@/components/Navigation";

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-32 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Centre d'aide</h1>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Premiers pas</h2>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-accent">
                    Créer un compte
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-accent">
                    Configurer votre boutique
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-accent">
                    Télécharger des designs
                  </a>
                </li>
              </ul>
            </div>
            <div className="p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Commandes</h2>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-accent">
                    Suivi de commande
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-accent">
                    Politique de retour
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-accent">
                    Expédition
                  </a>
                </li>
              </ul>
            </div>
            <div className="p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Technique</h2>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-accent">
                    Spécifications des fichiers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-accent">
                    API Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-accent">
                    Intégrations
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
