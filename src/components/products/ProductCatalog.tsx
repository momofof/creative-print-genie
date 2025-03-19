
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { productCategories, allProducts } from "@/data/productData";
import { Card, CardContent } from "@/components/ui/card";

const ProductCatalog = () => {
  // Sélectionner les catégories principales pour l'affichage en vedette
  const featuredCategories = [
    { id: "textile", name: "T-Shirts", actionText: "Trouvez votre style" },
    { id: "sweats", name: "Hoodies", actionText: "Explorez maintenant" },
  ];

  // Groupes de produits pour l'affichage par catégorie
  const productGroups = [
    {
      title: "Vêtements à personnaliser",
      categories: productCategories.filter(cat => 
        ["textile", "accessoires"].includes(cat.id)
      ).slice(0, 6)
    },
    {
      title: "Ces produits sont parfaits pour les cadeaux, groupes et occasions spéciales",
      categories: productCategories.filter(cat => 
        ["emballage", "bijoux", "ustensiles", "papier"].includes(cat.id)
      ).slice(0, 6)
    }
  ];

  // Catégories pour "Quelque chose de personnalisé pour tous"
  const forEveryoneCategories = [
    { id: "homme", title: "Hommes", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80" },
    { id: "femme", title: "Femmes", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80" },
    { id: "enfant", title: "Enfants", image: "https://images.unsplash.com/photo-1611784728174-2ac2a920472b?auto=format&fit=crop&w=800&q=80" },
  ];

  return (
    <div className="bg-white">
      {/* Bannière principale */}
      <section className="relative w-full h-[500px] overflow-hidden">
        <img 
          src="/lovable-uploads/2225730c-624e-4d36-9e30-edd1adac5087.png" 
          alt="Personnalisez vos vêtements" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="bg-white/90 max-w-md ml-auto p-8 rounded-lg">
              <h1 className="text-2xl font-bold mb-3">Design Custom Clothing & Accessories</h1>
              <p className="mb-6">Créez des t-shirts, hoodies personnalisés et bien plus encore avec notre éditeur en ligne</p>
              <Link 
                to="/customize" 
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-md inline-block font-medium"
              >
                Créer maintenant
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Promotion */}
      <section className="py-8 text-center bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-xl font-medium">Jusqu'à 60% de réduction</h2>
          <p className="text-gray-600">Obtenez une remise plus importante lorsque vous commandez 5 articles ou plus</p>
        </div>
      </section>

      {/* Navigation des catégories */}
      <section className="border-b">
        <div className="container mx-auto">
          <div className="flex overflow-x-auto py-4 space-x-6 px-4 no-scrollbar">
            <Link to="/products" className="whitespace-nowrap text-gray-800 hover:text-teal-600 font-medium">
              Produits
            </Link>
            <Link to="/products" className="whitespace-nowrap text-gray-800 hover:text-teal-600 font-medium">
              Catégories
            </Link>
            <Link to="/custom-design" className="whitespace-nowrap text-gray-800 hover:text-teal-600 font-medium">
              Broderie
            </Link>
            <Link to="/pro" className="whitespace-nowrap text-gray-800 hover:text-teal-600 font-medium">
              Business
            </Link>
            <Link to="/products/accessoires" className="whitespace-nowrap text-gray-800 hover:text-teal-600 font-medium">
              Cadeaux
            </Link>
            <Link to="/pro" className="whitespace-nowrap text-gray-800 hover:text-teal-600 font-medium">
              Groupes
            </Link>
            <Link to="/custom-design" className="whitespace-nowrap text-gray-800 hover:text-teal-600 font-medium">
              Service Graphique
            </Link>
            <Link to="/support" className="whitespace-nowrap text-gray-800 hover:text-teal-600 font-medium">
              Aide
            </Link>
          </div>
        </div>
      </section>

      {/* Titre principal */}
      <section className="py-10">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold mb-2">Your Clothes. Your Way</h1>
          <p className="text-xl text-gray-600">Clothing to customize</p>
        </div>
      </section>

      {/* Catégories en vedette */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <p className="text-gray-600 mb-8 text-center">
            Ajoutez vos images, graphiques et texte à nos vêtements de qualité - commencez avec un design existant ou créez le vôtre.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredCategories.map((cat, index) => (
              <Link 
                key={index} 
                to={`/products/${cat.id}`}
                className="block group relative overflow-hidden bg-blue-50 rounded-lg"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img 
                    src={productCategories.find(c => c.id === cat.id)?.image || ''}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-2xl font-bold mb-1 text-teal-600">{cat.name}</h3>
                    <div className="flex items-center text-teal-600 font-medium">
                      <span>{cat.actionText}</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Groupes de produits par catégorie */}
      {productGroups.map((group, groupIndex) => (
        <section key={groupIndex} className="py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-xl text-center mb-8">{group.title}</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {group.categories.map((category, index) => (
                <Card key={index} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
                  <Link to={`/products/${category.id}`}>
                    <div className="aspect-square w-full">
                      <img 
                        src={category.image}
                        alt={category.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-3">
                      <h3 className="text-sm font-medium text-center text-teal-600">{category.title}</h3>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Quelque chose pour tous */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Something Custom for Everyone</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {forEveryoneCategories.map((category, index) => (
              <Link 
                key={index}
                to={`/products/${category.id}`}
                className="block group"
              >
                <div className="aspect-square bg-amber-50 rounded-lg overflow-hidden">
                  <img 
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mt-3 flex items-center text-teal-600 font-medium">
                  <span>{category.title}</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductCatalog;
