
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative pt-24 md:pt-36 pb-20 overflow-hidden bg-white">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-16">
          {/* Left content - now includes the button on desktop */}
          <div className="w-full lg:w-1/2 space-y-8 z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="block text-gray-900">Donnez vie à vos</span>
              <span className="block text-accent mt-2">idées créatives</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-xl">
              Créez des designs uniques et personnalisés en quelques minutes.
              Notre plateforme intuitive vous permet de réaliser vos projets rapidement et simplement.
            </p>
            
            {/* Button is here for desktop */}
            <div className="lg:block">
              <Link
                to="/create"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-lg font-medium text-white bg-black rounded-xl hover:bg-gray-800 transition-colors"
              >
                Créer maintenant
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          {/* Right content - image */}
          <div className="w-full lg:w-1/2 relative">
            <img
              src="/lovable-uploads/d28240cb-3480-4969-9eaf-7e5a3db73a93.png"
              alt="Creative design platform interface"
              className="w-full h-auto object-cover rounded-xl shadow-2xl"
            />
            
            {/* Button is here for mobile only */}
            <div className="lg:hidden mt-8 text-center">
              <Link
                to="/create"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-lg font-medium text-white bg-black rounded-xl hover:bg-gray-800 transition-colors"
              >
                Créer maintenant
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
