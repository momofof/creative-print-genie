
import { Link } from "react-router-dom";

interface ProductHeroProps {
  categoryImage: string;
  categoryTitle: string;
}

const ProductHero = ({ categoryImage, categoryTitle }: ProductHeroProps) => {
  return (
    <div className="relative w-full h-[60vh] mb-8">
      <div 
        className="w-full h-full bg-cover bg-center" 
        style={{ backgroundImage: `url(${categoryImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-md bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-2">{categoryTitle}</h2>
              <p className="text-gray-600 mb-4">Découvrez notre collection de {categoryTitle.toLowerCase()} personnalisables pour votre marque ou événement.</p>
              <Link 
                to="#products" 
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-md inline-block transition-colors"
              >
                Voir les produits
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductHero;
