
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] w-full">
      {/* Full-width background image */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src="https://images.unsplash.com/photo-1626947346165-4c2288dadc2a?auto=format&fit=crop&w=2000&q=80" 
          alt="Person wearing customized apparel" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 md:bg-opacity-40"></div>
      </div>
      
      {/* Content container with alignment adjusted to bottom of image with small margin */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-8 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-white space-y-5 md:max-w-xl">
          <div className="space-y-2 md:space-y-3">
            <h2 className="text-lg sm:text-xl font-medium">Vos Idées, Votre Style</h2>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">VOTRE CRÉATION</h1>
          </div>
          <p className="text-base sm:text-lg max-w-md mb-8">
            Donnez vie à vos designs sur une variété de produits de qualité. Imprimez à la demande sans stock minimum.
          </p>
          
          {/* Button integrated with text for better alignment */}
          <div>
            <Link to="/create" className="bg-white text-gray-900 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 rounded font-medium shadow-sm transition-colors text-base sm:text-lg inline-block">
              Créer Maintenant
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
