
import { Link } from "react-router-dom";

interface ProductBreadcrumbsProps {
  categoryTitle: string;
}

const ProductBreadcrumbs = ({ categoryTitle }: ProductBreadcrumbsProps) => {
  return (
    <div className="container mx-auto px-4 mb-8">
      <div className="flex items-center text-sm text-gray-500 space-x-2">
        <Link to="/" className="hover:text-teal-500 transition-colors">Accueil</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-teal-500 transition-colors">Produits</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{categoryTitle}</span>
      </div>
    </div>
  );
};

export default ProductBreadcrumbs;
