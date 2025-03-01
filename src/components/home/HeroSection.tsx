
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
      
      {/* Overlay text */}
      <div className="relative z-10 h-full flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-white space-y-4 sm:space-y-6 max-w-xl">
          <div className="space-y-2 sm:space-y-3">
            <h2 className="text-lg sm:text-xl font-medium">Vos Idées, Votre Style</h2>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">VOTRE CRÉATION</h1>
          </div>
          <p className="text-base sm:text-lg max-w-md">
            Donnez vie à vos designs sur une variété de produits de qualité. Imprimez à la demande sans stock minimum.
          </p>
        </div>
      </div>

      {/* Button positioned at the bottom of the image with small margin for both mobile and desktop */}
      <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center px-4 md:justify-start md:left-24 md:right-auto md:px-0">
        <Link to="/create" className="bg-white text-gray-900 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 rounded font-medium shadow-sm transition-colors text-base sm:text-lg">
          Créer Maintenant
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
