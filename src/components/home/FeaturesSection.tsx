
const FeaturesSection = () => {
  const features = [
    {
      title: "Aucun Stock Requis",
      description: "Les produits sont imprimés et expédiés uniquement à la commande."
    }, 
    {
      title: "Produits de Qualité",
      description: "Partenariat avec des fabricants premium pour une qualité optimale."
    }, 
    {
      title: "Facile à Utiliser",
      description: "Des outils de conception simples pour donner vie à vos idées."
    }
  ];

  return (
    <section className="py-8 sm:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-8 sm:mb-12 text-center">
          Pourquoi Nous Choisir
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-4 sm:p-6 rounded-2xl bg-white border border-gray-100 hover:border-accent transition-colors"
            >
              <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-3">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
