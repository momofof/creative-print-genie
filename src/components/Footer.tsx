import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Youtube, CreditCard, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

const Footer = () => {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Merci de vous être inscrit à notre newsletter!");
  };

  return (
    <footer className="bg-gray-100 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">À Propos</h3>
            <p className="text-gray-600 text-sm mb-4">
              Nous sommes spécialisés dans l'impression personnalisée de qualité supérieure pour particuliers et entreprises depuis plus de 10 ans.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-500 hover:text-accent transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-accent transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-accent transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-accent transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-600 hover:text-accent transition-colors text-sm">
                  Nos Produits
                </Link>
              </li>
              <li>
                <Link to="/custom-design" className="text-gray-600 hover:text-accent transition-colors text-sm">
                  Services de Design
                </Link>
              </li>
              <li>
                <Link to="/pro" className="text-gray-600 hover:text-accent transition-colors text-sm">
                  Solutions Professionnelles
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-accent transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-600 hover:text-accent transition-colors text-sm">
                  Support Technique
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="text-accent mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 text-sm">
                  123 Boulevard de l'Impression, 75001 Paris, France
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-accent mr-2 flex-shrink-0" />
                <span className="text-gray-600 text-sm">+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-accent mr-2 flex-shrink-0" />
                <span className="text-gray-600 text-sm">contact@impression-personnalisee.fr</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-600 text-sm mb-4">
              Abonnez-vous pour recevoir des offres exclusives et les dernières tendances.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <Input 
                type="email" 
                placeholder="Votre email" 
                required 
                className="bg-white" 
              />
              <Button type="submit" className="w-full">
                S'abonner
              </Button>
            </form>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-200 pt-6 pb-4">
          <h4 className="text-sm font-medium mb-3 text-center">Méthodes de Paiement Acceptées</h4>
          <div className="flex justify-center space-x-4">
            <CreditCard size={32} className="text-gray-600" />
            <img src="https://www.mastercard.fr/content/dam/public/mastercardcom/eu/fr/images/logo-mastercard.svg" alt="Mastercard" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1280px-Visa_Inc._logo.svg.png" alt="Visa" className="h-8" />
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Impression Personnalisée. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
