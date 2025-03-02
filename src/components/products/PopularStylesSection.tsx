
interface PopularStylesProps {
  categoryTitle: string;
}

const PopularStylesSection = ({ categoryTitle }: PopularStylesProps) => {
  return (
    <div className="container mx-auto px-4 mb-16" id="products">
      <h2 className="text-2xl font-bold mb-6">Styles Populaires</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, idx) => (
          <div key={idx} className="group">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2 relative">
              <img 
                src={`https://images.unsplash.com/photo-${500 + idx}?auto=format&fit=crop&w=300&q=80`} 
                alt={`Style ${idx + 1}`} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {idx === 0 && (
                <span className="absolute top-2 left-2 bg-teal-500 text-white text-xs px-2 py-1 rounded">
                  Bestseller
                </span>
              )}
            </div>
            <h3 className="font-medium text-sm">{categoryTitle} Style {idx + 1}</h3>
            <p className="text-teal-600 text-sm">19,99 €</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularStylesSection;
