
import React from "react";

const ProfileFooter = () => {
  return (
    <footer className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 className="font-semibold mb-4">Service</h3>
        <ul className="space-y-2">
          <li><a href="#" className="text-gray-600 hover:text-accent">Aide</a></li>
          <li><a href="#" className="text-gray-600 hover:text-accent">Contact</a></li>
          <li>
            <p className="text-gray-600">1-800-123-4567</p>
            <p className="text-gray-500 text-sm">Lun - Ven, 8am - 7pm CET</p>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="font-semibold mb-4">La Société</h3>
        <ul className="space-y-2">
          <li><a href="#" className="text-gray-600 hover:text-accent">À propos de nous</a></li>
          <li><a href="#" className="text-gray-600 hover:text-accent">Affiliés</a></li>
          <li><a href="#" className="text-gray-600 hover:text-accent">Presse</a></li>
          <li><a href="#" className="text-gray-600 hover:text-accent">Confidentialité</a></li>
          <li><a href="#" className="text-gray-600 hover:text-accent">Paramètres des données</a></li>
          <li><a href="#" className="text-gray-600 hover:text-accent">Conditions générales</a></li>
          <li><a href="#" className="text-gray-600 hover:text-accent">Mentions légales</a></li>
        </ul>
      </div>
      
      <div>
        <h3 className="font-semibold mb-4">Suivez-nous</h3>
        <ul className="space-y-2">
          <li><a href="#" className="text-gray-600 hover:text-accent">Facebook</a></li>
          <li><a href="#" className="text-gray-600 hover:text-accent">Twitter</a></li>
          <li><a href="#" className="text-gray-600 hover:text-accent">Instagram</a></li>
          <li><a href="#" className="text-gray-600 hover:text-accent">Pinterest</a></li>
          <li><a href="#" className="text-gray-600 hover:text-accent">Flickr</a></li>
          <li><a href="#" className="text-gray-600 hover:text-accent">Youtube</a></li>
          <li><a href="#" className="text-gray-600 hover:text-accent">Forum</a></li>
          <li><a href="#" className="text-gray-600 hover:text-accent">Blog</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default ProfileFooter;
