
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState('next');
  
  // Collection of hero images
  const heroImages = [
    "https://images.unsplash.com/photo-1626947346165-4c2288dadc2a?auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=2000&q=80"
  ];

  // Rotate through images automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection('next');
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Manual navigation function
  const navigateToSlide = (index: number) => {
    setDirection(index > currentImageIndex ? 'next' : 'prev');
    setCurrentImageIndex(index);
  };

  return (
    <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] w-full overflow-hidden">
      {/* Full-width background image slider */}
      <div className="absolute inset-0 w-full h-full">
        {/* Images container with horizontal sliding effect */}
        <div className="absolute inset-0 w-full h-full">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out ${
                index === currentImageIndex 
                  ? "translate-x-0 z-10" 
                  : direction === 'next'
                    ? "translate-x-full z-0"
                    : "-translate-x-full z-0"
              }`}
              style={{ 
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          ))}
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 md:bg-opacity-40 z-20"></div>
        </div>
      </div>
      
      {/* Content container with alignment adjusted to bottom of image with small margin */}
      <div className="relative z-30 h-full flex flex-col justify-end pb-8 max-w-7xl mx-auto px-4 sm:px-6 md:pl-4 lg:pl-8">
        <div className="text-white space-y-5 md:max-w-xl">
          <div className="space-y-2 md:space-y-3">
            <h2 className="text-lg sm:text-xl font-medium">Vos Idées, Votre Style</h2>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">VOTRE CRÉATION</h1>
          </div>
          
          {/* Button integrated with text for better alignment */}
          <div>
            <Link to="/create" className="bg-white text-gray-900 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 rounded font-medium shadow-sm transition-colors text-base sm:text-lg inline-block">
              Créer Maintenant
            </Link>
          </div>
        </div>
      </div>

      {/* Image navigation indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40 flex space-x-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => navigateToSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentImageIndex ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
