
import { Link } from "react-router-dom";

const FeaturedCollectionSection = () => {
  return (
    <div className="bg-gray-50 py-12 mb-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Collection Tendance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-${600 + idx}?auto=format&fit=crop&w=500&q=80`} 
                  alt={`Collection ${idx + 1}`} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1">Collection {idx + 1}</h3>
                <p className="text-gray-600 text-sm mb-3">Des designs uniques pour votre marque</p>
                <Link 
                  to="#" 
                  className="text-teal-600 text-sm font-medium hover:text-teal-800 transition-colors"
                >
                  Découvrir →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCollectionSection;
