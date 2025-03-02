
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, 
  Star, 
  Settings, 
  Briefcase, 
  Users, 
  BarChart, 
  PenTool, 
  ShoppingBag, 
  Truck, 
  TShirt,
  MessageSquare
} from "lucide-react";

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

  const businessServices = [
    {
      title: "Uniformes d'entreprise",
      description: "Créez des uniformes cohérents avec votre image de marque pour toute votre équipe",
      icon: TShirt,
      image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Produits promotionnels",
      description: "Concevez des produits attractifs pour vos campagnes marketing et événements",
      icon: ShoppingBag,
      image: "https://images.unsplash.com/photo-1577937127861-20ef40a3df83?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Événements d'entreprise",
      description: "Préparez vos événements avec des articles personnalisés pour renforcer votre image",
      icon: Users,
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80"
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-24 pb-0">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Solutions Professionnelles</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Des services spécialement conçus pour les professionnels et les entreprises qui souhaitent renforcer leur image de marque et leur cohésion d'équipe.
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

          {/* Business Services */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Services pour Entreprises</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {businessServices.map((service, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-start mb-3">
                      <div className="bg-secondary/70 p-2 rounded-full mr-3">
                        <service.icon size={20} className="text-accent" />
                      </div>
                      <h3 className="text-xl font-semibold">{service.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <Button variant="outline" className="w-full hover:bg-accent hover:text-black">
                      En savoir plus
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Design Service */}
          <div className="mb-16 bg-gray-50 rounded-2xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center mb-4">
                  <PenTool className="text-accent mr-2" size={24} />
                  <h2 className="text-2xl md:text-3xl font-bold">Service de Design Professionnel</h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Notre équipe de designers experts vous aide à créer des designs qui capturent parfaitement l'esprit de votre marque. Du concept à la réalisation, nous sommes là pour donner vie à vos idées.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <span className="text-accent mr-2">✓</span>
                    Conception graphique personnalisée
                  </li>
                  <li className="flex items-center">
                    <span className="text-accent mr-2">✓</span>
                    Révisions illimitées
                  </li>
                  <li className="flex items-center">
                    <span className="text-accent mr-2">✓</span>
                    Fichiers sources pour une utilisation future
                  </li>
                </ul>
                <Button className="self-start">Contacter un designer</Button>
              </div>
              <div className="hidden md:block">
                <img 
                  src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80" 
                  alt="Service de Design" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Ce que disent nos clients professionnels</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "Sophie Martin",
                  company: "Agence Créative",
                  comment: "La qualité des t-shirts et l'impression sont exceptionnelles. Notre équipe est ravie de porter ces uniformes lors de nos événements.",
                  avatar: "https://randomuser.me/api/portraits/women/12.jpg"
                },
                {
                  name: "Thomas Dubois",
                  company: "StartUp Tech",
                  comment: "Le service de design nous a aidés à créer des goodies parfaitement alignés avec notre identité visuelle. Nos clients adorent!",
                  avatar: "https://randomuser.me/api/portraits/men/32.jpg"
                },
                {
                  name: "Marie Lambert",
                  company: "Événementiel Premium",
                  comment: "Les délais de livraison ont été respectés pour un événement important. Qualité impeccable et service client réactif.",
                  avatar: "https://randomuser.me/api/portraits/women/44.jpg"
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full mr-4 object-cover" 
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-gray-600 text-sm">{testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.comment}"</p>
                  <div className="flex mt-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-secondary/30 rounded-2xl p-8 md:p-12 mb-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Prêt à passer au niveau supérieur?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Découvrez comment nos solutions professionnelles peuvent transformer votre activité et vous aider à atteindre vos objectifs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent hover:bg-accent/80 text-black font-medium transition-colors shadow-sm">
                  <MessageSquare size={18} className="mr-2" /> Demander une démo
                </Button>
                <Button size="lg" variant="outline">
                  <BarChart size={18} className="mr-2" /> Voir nos tarifs
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Pro;
