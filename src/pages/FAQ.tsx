
import Navigation from "@/components/Navigation";

const FAQ = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-32 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">FAQ</h1>
          <div className="space-y-6">
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-2">
                Quels sont les délais de livraison ?
              </h2>
              <p className="text-gray-600">
                Les délais varient entre 3 et 5 jours ouvrés selon la destination.
              </p>
            </div>
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-2">
                Quels formats de fichiers acceptez-vous ?
              </h2>
              <p className="text-gray-600">
                Nous acceptons les formats PNG, JPG, et PDF en haute résolution.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Comment sont calculés les prix ?
              </h2>
              <p className="text-gray-600">
                Les prix sont basés sur le type de produit, la quantité et les options de personnalisation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
