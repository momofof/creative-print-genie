
import Navigation from "@/components/Navigation";
import { Shield, Star, Settings, Briefcase } from "lucide-react";

const Pro = () => {
  const proFeatures = [
    {
      title: "Accès prioritaire",
      description: "Profitez d'un accès prioritaire à nos services et d'un support dédié",
      icon: Star,
    },
    {
      title: "Fonctionnalités avancées",
      description: "Accédez à des outils et des fonctionnalités exclusives pour optimiser votre expérience",
      icon: Settings,
    },
    {
      title: "Support premium",
      description: "Une équipe dédiée à votre disposition pour répondre à toutes vos questions",
      icon: Shield,
    },
    {
      title: "Solutions personnalisées",
      description: "Des solutions sur mesure adaptées à vos besoins spécifiques",
      icon: Briefcase,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Découvrez nos solutions Pro</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Des outils et services spécialement conçus pour les professionnels et les entreprises qui souhaitent aller plus loin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {proFeatures.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="bg-secondary/50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <feature.icon className="text-accent" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-secondary/30 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Prêt à passer au niveau supérieur?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Découvrez comment nos solutions professionnelles peuvent transformer votre activité et vous aider à atteindre vos objectifs.
            </p>
            <button className="bg-accent hover:bg-accent/80 text-black font-medium py-3 px-8 rounded-full transition-colors shadow-sm">
              Demander une démo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pro;
