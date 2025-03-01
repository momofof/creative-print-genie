
import Navigation from "@/components/Navigation";
import { productCategories } from "@/data/productData";
import { Link, useParams } from "react-router-dom";

const Products = () => {
  const { categoryId, subcategoryId } = useParams();
  
  // Filter categories based on URL parameters
  const displayedCategories = categoryId 
    ? productCategories.filter(cat => cat.id === categoryId) 
    : productCategories;

  // Find the current category if we're on a specific category page
  const currentCategory = categoryId 
    ? productCategories.find(cat => cat.id === categoryId)
    : null;

  // If we're viewing a specific category, show the detailed page design
  if (currentCategory) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-24 pb-16">
          {/* Hero Banner Section */}
          <div className="relative w-full h-[60vh] mb-8">
            <div 
              className="w-full h-full bg-cover bg-center" 
              style={{ backgroundImage: `url(${currentCategory.image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-md bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-2">{currentCategory.title}</h2>
                    <p className="text-gray-600 mb-4">Découvrez notre collection de {currentCategory.title.toLowerCase()} personnalisables pour votre marque ou événement.</p>
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

          {/* Navigation Breadcrumbs */}
          <div className="container mx-auto px-4 mb-8">
            <div className="flex items-center text-sm text-gray-500 space-x-2">
              <Link to="/" className="hover:text-teal-500 transition-colors">Accueil</Link>
              <span>/</span>
              <Link to="/products" className="hover:text-teal-500 transition-colors">Produits</Link>
              <span>/</span>
              <span className="text-gray-800 font-medium">{currentCategory.title}</span>
            </div>
          </div>

          {/* Subcategory Pills */}
          <div className="container mx-auto px-4 mb-10">
            <div className="flex flex-wrap gap-2">
              {currentCategory.subcategories.map((subcategory, index) => (
                <Link 
                  key={index}
                  to={`/products/${currentCategory.id}/${subcategory.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-4 py-2 bg-gray-100 hover:bg-teal-100 rounded-full text-sm transition-colors"
                >
                  {subcategory}
                </Link>
              ))}
            </div>
          </div>

          {/* Popular Styles Section */}
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
                  <h3 className="font-medium text-sm">{currentCategory.title} Style {idx + 1}</h3>
                  <p className="text-teal-600 text-sm">19,99 €</p>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Collection */}
          <div className="bg-gray-50 py-12 mb-16">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-6">Collection Tendance</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img 
                        src={`https://images.unsplash.com/photo-${600 + idx}?auto=format&fit=crop&w=500&q=80`} 
                        alt={`Collection ${idx + 1}`} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-1">Collection {idx + 1}</h3>
                      <p className="text-gray-600 text-sm mb-3">Des designs uniques pour votre marque</p>
                      <Link 
                        to="#" 
                        className="text-teal-600 text-sm font-medium hover:text-teal-800 transition-colors"
                      >
                        Découvrir →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* New Arrivals */}
          <div className="container mx-auto px-4 mb-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Nouveautés</h2>
              <div className="flex space-x-2">
                <button aria-label="Previous" className="p-2 border rounded-full">
                  &larr;
                </button>
                <button aria-label="Next" className="p-2 border rounded-full">
                  &rarr;
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2 relative">
                    <img 
                      src={`https://images.unsplash.com/photo-${700 + idx}?auto=format&fit=crop&w=400&q=80`} 
                      alt={`Nouveauté ${idx + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-full bg-white text-gray-900 py-2 rounded-md font-medium">
                        Aperçu Rapide
                      </button>
                    </div>
                  </div>
                  <h3 className="font-medium">{currentCategory.title} Premium {idx + 1}</h3>
                  <p className="text-teal-600">24,99 €</p>
                </div>
              ))}
            </div>
          </div>

          {/* Promotional Banner */}
          <div className="container mx-auto px-4 mb-16">
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                    Promotion Spéciale
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Remise de 15% sur les commandes groupées</h2>
                  <p className="text-gray-600 mb-6">
                    Commandez plus de 10 articles et bénéficiez d'une remise instantanée. Offre valable jusqu'à la fin du mois.
                  </p>
                  <div>
                    <Link 
                      to="#" 
                      className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-md inline-block transition-colors"
                    >
                      En savoir plus
                    </Link>
                  </div>
                </div>
                <div className="hidden md:block">
                  <img 
                    src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80" 
                    alt="Promotion" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Design Service Banner */}
          <div className="container mx-auto px-4 mb-16">
            <div className="bg-teal-50 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-3">Service de Design Personnalisé</h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                Besoin d'aide pour créer un design unique ? Notre équipe de designers professionnels est là pour vous aider à concrétiser vos idées.
              </p>
              <Link 
                to="/services/custom-design" 
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-md inline-block transition-colors"
              >
                Demander un devis
              </Link>
            </div>
          </div>

          {/* Recently Viewed */}
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
                  <h3 className="font-medium text-sm truncate">{currentCategory.title} Classic {idx + 1}</h3>
                  <p className="text-teal-600 text-sm">22,99 €</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If we're not viewing a specific category, show the categories grid
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-32 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Notre Catalogue</h1>
          <p className="text-lg text-gray-600 mb-10">
            Découvrez notre gamme complète de produits personnalisables.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <Link to={`/products/${category.id}`} className="block aspect-video w-full overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.title} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                  />
                </Link>
                <div className="p-5">
                  <Link to={`/products/${category.id}`}>
                    <h2 className="text-xl font-semibold mb-3 hover:text-accent transition-colors">{category.title}</h2>
                  </Link>
                  <div className="space-y-2">
                    {category.subcategories.map((subcategory, index) => (
                      <Link 
                        key={index} 
                        to={`/products/${category.id}/${subcategory.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block py-2 px-3 rounded-md bg-secondary/50 hover:bg-secondary hover:text-accent transition-colors text-sm"
                      >
                        {subcategory}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
