
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  PenTool, 
  CheckCircle, 
  Clock, 
  Zap, 
  MessageSquare,
  Users,
  FileText
} from "lucide-react";

const CustomDesign = () => {
  const designProcess = [
    {
      title: "Consultation",
      description: "Nous discutons de vos besoins, objectifs et idées pour comprendre votre vision.",
      icon: MessageSquare
    },
    {
      title: "Concept",
      description: "Nos designers créent plusieurs concepts initiaux basés sur vos spécifications.",
      icon: PenTool
    },
    {
      title: "Révision",
      description: "Vous examinez les concepts et fournissez des commentaires pour affiner le design.",
      icon: FileText
    },
    {
      title: "Finalisation",
      description: "Nous peaufinons le design choisi et préparons les fichiers pour l'impression.",
      icon: CheckCircle
    }
  ];

  const portfolioItems = [
    {
      title: "Logo d'entreprise",
      client: "TechStart",
      image: "https://images.unsplash.com/photo-1553531889-e6cf4d692b1b?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "T-shirts événement",
      client: "Festival Musique",
      image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Uniformes d'équipe",
      client: "SportTeam Inc.",
      image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-24 pb-0">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-gray-100 to-gray-200 py-16 mb-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl font-bold mb-4">Service de Design Personnalisé</h1>
                <p className="text-lg text-gray-600 mb-6">
                  Nos designers professionnels donnent vie à vos idées avec des créations uniques
                  qui reflètent parfaitement votre marque ou votre vision.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="text-accent mr-3" size={20} />
                    <span>Designs originaux et créatifs</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="text-accent mr-3" size={20} />
                    <span>Révisions illimitées</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="text-accent mr-3" size={20} />
                    <span>Formats optimisés pour l'impression</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="text-accent mr-3" size={20} />
                    <span>Accompagnement personnalisé</span>
                  </div>
                </div>
                <Button className="mt-8" size="lg">
                  Demander un devis gratuit
                </Button>
              </div>
              <div className="hidden md:block">
                <img 
                  src="https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80" 
                  alt="Design Service" 
                  className="rounded-lg shadow-lg" 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          {/* Services Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Nos Services de Design</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="bg-accent/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <PenTool className="text-accent" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Design Graphique</h3>
                  <p className="text-gray-600 mb-4">
                    Logos, illustrations, motifs et designs graphiques pour tous vos besoins d'impression.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <span className="text-accent mr-2">✓</span>
                      <span className="text-sm">Création de logos</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2">✓</span>
                      <span className="text-sm">Illustrations personnalisées</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2">✓</span>
                      <span className="text-sm">Motifs et textures</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full">En savoir plus</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="bg-accent/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Users className="text-accent" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Design d'Équipe</h3>
                  <p className="text-gray-600 mb-4">
                    Uniformes, t-shirts d'équipe et accessoires assortis pour votre entreprise ou événement.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <span className="text-accent mr-2">✓</span>
                      <span className="text-sm">Uniformes d'entreprise</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2">✓</span>
                      <span className="text-sm">T-shirts pour événements</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2">✓</span>
                      <span className="text-sm">Accessoires coordonnés</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full">En savoir plus</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="bg-accent/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Zap className="text-accent" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Design Express</h3>
                  <p className="text-gray-600 mb-4">
                    Service accéléré pour vos projets urgents avec des délais de livraison rapides.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <span className="text-accent mr-2">✓</span>
                      <span className="text-sm">Délai de 24-48h</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2">✓</span>
                      <span className="text-sm">Révisions prioritaires</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2">✓</span>
                      <span className="text-sm">Assistance dédiée</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full">En savoir plus</Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Process */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Notre Processus de Design</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {designProcess.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="bg-secondary/70 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto relative">
                    <step.icon className="text-accent" size={32} />
                    <div className="absolute -top-2 -right-2 bg-accent text-black w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Notre Portfolio</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {portfolioItems.map((item, index) => (
                <div key={index} className="group overflow-hidden rounded-lg relative">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <h3 className="text-white font-semibold text-xl">{item.title}</h3>
                    <p className="text-white/80">Client: {item.client}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline">
                Voir plus de réalisations
              </Button>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-16 bg-gray-50 p-8 rounded-xl">
            <h2 className="text-3xl font-bold mb-8 text-center">Ce que disent nos clients</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  name: "Pierre Lefèvre",
                  company: "Restaurant Le Bistro",
                  comment: "L'équipe de design a compris notre identité dès le premier échange. Les t-shirts de notre personnel sont magnifiques et correspondent parfaitement à l'ambiance de notre restaurant.",
                  avatar: "https://randomuser.me/api/portraits/men/11.jpg"
                },
                {
                  name: "Émilie Bernard",
                  company: "Association Sportive",
                  comment: "Service réactif et designs de qualité pour nos t-shirts d'équipe. Le processus de révision était fluide et les designers ont parfaitement intégré nos feedbacks.",
                  avatar: "https://randomuser.me/api/portraits/women/23.jpg"
                }
              ].map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <p className="italic text-gray-700 mb-4">"{testimonial.comment}"</p>
                    <div className="flex items-center">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name} 
                        className="w-12 h-12 rounded-full mr-4" 
                      />
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-gray-600 text-sm">{testimonial.company}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-accent/10 rounded-xl p-8 md:p-12 mb-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Prêt à créer votre design personnalisé?</h2>
              <p className="text-lg mb-8">
                Contactez-nous dès aujourd'hui pour discuter de votre projet et obtenir un devis gratuit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent text-black hover:bg-accent/80">
                  Demander un devis
                </Button>
                <Button size="lg" variant="outline">
                  Planifier un appel
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

export default CustomDesign;
