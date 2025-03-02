
interface RecentlyViewedSectionProps {
  categoryTitle: string;
}

const RecentlyViewedSection = ({ categoryTitle }: RecentlyViewedSectionProps) => {
  return (
    <div className="container mx-auto px-4 mb-16">
      <h2 className="text-2xl font-bold mb-6">Récemment Consultés</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, idx) => (
          <div key={idx} className="group">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
              <img 
                src={`https://images.unsplash.com/photo-${800 + idx}?auto=format&fit=crop&w=300&q=80`} 
                alt={`Produit ${idx + 1}`} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="font-medium text-sm truncate">{categoryTitle} Classic {idx + 1}</h3>
            <p className="text-teal-600 text-sm">22,99 €</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewedSection;
