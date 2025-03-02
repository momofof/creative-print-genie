
interface NewArrivalsSectionProps {
  categoryTitle: string;
}

const NewArrivalsSection = ({ categoryTitle }: NewArrivalsSectionProps) => {
  return (
    <div className="container mx-auto px-4 mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Nouveautés</h2>
        <div className="flex space-x-2">
          <button aria-label="Previous" className="p-2 border rounded-full">
            &larr;
          </button>
          <button aria-label="Next" className="p-2 border rounded-full">
            &rarr;
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="group">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2 relative">
              <img 
                src={`https://images.unsplash.com/photo-${700 + idx}?auto=format&fit=crop&w=400&q=80`} 
                alt={`Nouveauté ${idx + 1}`} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-full bg-white text-gray-900 py-2 rounded-md font-medium">
                  Aperçu Rapide
                </button>
              </div>
            </div>
            <h3 className="font-medium">{categoryTitle} Premium {idx + 1}</h3>
            <p className="text-teal-600">24,99 €</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewArrivalsSection;
