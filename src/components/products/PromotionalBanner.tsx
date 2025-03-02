
import { Link } from "react-router-dom";

const PromotionalBanner = () => {
  return (
    <div className="container mx-auto px-4 mb-16">
      <div className="bg-gray-100 rounded-lg overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              Promotion Spéciale
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Remise de 15% sur les commandes groupées</h2>
            <p className="text-gray-600 mb-6">
              Commandez plus de 10 articles et bénéficiez d'une remise instantanée. Offre valable jusqu'à la fin du mois.
            </p>
            <div>
              <Link 
                to="#" 
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-md inline-block transition-colors"
              >
                En savoir plus
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80" 
              alt="Promotion" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalBanner;
