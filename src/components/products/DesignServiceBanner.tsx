
import { Link } from "react-router-dom";

const DesignServiceBanner = () => {
  return (
    <div className="container mx-auto px-4 mb-16">
      <div className="bg-teal-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Service de Design Personnalisé</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Besoin d'aide pour créer un design unique ? Notre équipe de designers professionnels est là pour vous aider à concrétiser vos idées.
        </p>
        <Link 
          to="/services/custom-design" 
          className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-md inline-block transition-colors"
        >
          Demander un devis
        </Link>
      </div>
    </div>
  );
};

export default DesignServiceBanner;
