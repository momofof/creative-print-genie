
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState('next');

  // Collection of hero images
  const heroImages = ["https://images.unsplash.com/photo-1626947346165-4c2288dadc2a?auto=format&fit=crop&w=2000&q=80", "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80", "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=2000&q=80", "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=2000&q=80"];

  // Rotate through images automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection('next');
      setCurrentImageIndex(prevIndex => prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Manual navigation functions
  const navigateToSlide = (index: number) => {
    setDirection(index > currentImageIndex ? 'next' : 'prev');
    setCurrentImageIndex(index);
  };

  const goToPrevSlide = () => {
    setDirection('prev');
    setCurrentImageIndex(prevIndex => prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1);
  };

  const goToNextSlide = () => {
    setDirection('next');
    setCurrentImageIndex(prevIndex => prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1);
  };

  return <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] w-full overflow-hidden">
      {/* Full-width background image slider */}
      <div className="absolute inset-0 w-full h-full">
        {/* Images container with horizontal sliding effect */}
        <div className="absolute inset-0 w-full h-full">
          {heroImages.map((image, index) => <div key={index} className={`absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out ${index === currentImageIndex ? "translate-x-0 z-10" : direction === 'next' ? "translate-x-full z-0" : "-translate-x-full z-0"}`} style={{
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />)}
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 md:bg-opacity-40 z-20"></div>
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div className="absolute inset-0 flex items-center justify-between z-30 px-2 sm:px-6">
        <button 
          onClick={goToPrevSlide}
          className="bg-black/30 hover:bg-black/50 text-white rounded-full p-1 sm:p-2 transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        <button 
          onClick={goToNextSlide}
          className="bg-black/30 hover:bg-black/50 text-white rounded-full p-1 sm:p-2 transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>
      
      {/* Content container - Improved positioning for better desktop display */}
      <div className="relative z-30 h-full flex flex-col justify-end pb-12 md:pb-16 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="text-white space-y-5 md:space-y-6 md:max-w-lg lg:max-w-xl">
          <div className="space-y-2 md:space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium">Vos Idées, Votre Style</h2>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">VOTRE CRÉATION</h1>
          </div>
          
          {/* Button with improved spacing */}
          <div className="pt-2 md:pt-4">
            <Link to="/create" className="bg-white text-gray-900 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 rounded font-medium shadow-md transition-colors text-base sm:text-lg inline-block">
              Créer Maintenant
            </Link>
          </div>
        </div>
      </div>

      {/* Image navigation indicators - redesigned for mobile */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40 flex space-x-1.5">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => navigateToSlide(index)}
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? "bg-white w-3 sm:w-4" 
                : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </section>;
};
export default HeroSection;
