
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Search } from "lucide-react";
import { allProducts } from "@/data/productData";
import ProductFilters from "./ProductFilters";
import ProductSort from "./ProductSort";
import ProductSearchBar from "./ProductSearchBar";
import ProductViewToggle from "./ProductViewToggle";

interface ProductListProps {
  categoryId?: string;
  subcategoryId?: string;
}

const ProductList = ({ categoryId, subcategoryId }: ProductListProps) => {
  // États pour les produits et les options d'affichage
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string[]>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Effet pour filtrer les produits en fonction des critères
  useEffect(() => {
    // Filtrer d'abord par catégorie et sous-catégorie (comme avant)
    let result = allProducts.filter(product => {
      if (categoryId && product.category !== categoryId) return false;
      if (subcategoryId && product.subcategory !== subcategoryId.replace(/-/g, ' ')) return false;
      return true;
    });

    // Appliquer le filtre de recherche
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(term) || 
        (product.description ? product.description.toLowerCase().includes(term) : false)
      );
    }

    // Appliquer les filtres sélectionnés
    Object.entries(appliedFilters).forEach(([category, options]) => {
      if (options.length === 0) return;
      
      // Logique de filtrage en fonction de la catégorie
      if (category === "Couleur") {
        result = result.filter(product => options.includes((product.color || "").toLowerCase()));
      } else if (category === "Prix") {
        result = result.filter(product => {
          const price = product.price;
          return options.some(range => {
            const [min, max] = range.split("-").map(Number);
            if (range === "30+") return price >= 30;
            return price >= min && price <= (max || Infinity);
          });
        });
      }
      // Ajoutez d'autres catégories de filtres selon les besoins
    });

    // Trier les produits
    result.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "newest":
          return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
        case "rating":
          return b.rating - a.rating;
        default:
          return 0; // relevance - pas de changement à l'ordre
      }
    });

    setFilteredProducts(result);
    setCurrentPage(1); // Réinitialise la pagination lors du changement de filtres
  }, [categoryId, subcategoryId, searchTerm, sortBy, appliedFilters]);

  // Gestionnaires d'événements
  const handleFilterChange = (category: string, option: string, checked: boolean) => {
    setAppliedFilters(prev => {
      const newFilters = { ...prev };
      if (!newFilters[category]) newFilters[category] = [];
      
      if (checked) {
        newFilters[category].push(option);
      } else {
        newFilters[category] = newFilters[category].filter(item => item !== option);
        if (newFilters[category].length === 0) delete newFilters[category];
      }
      
      return newFilters;
    });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSortChange = (sortOption: string) => {
    setSortBy(sortOption);
  };

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Aucun produit trouvé dans cette catégorie.</p>
        <Link to="/products">
          <Button variant="outline" className="mt-4">Voir toutes les catégories</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar avec filtres */}
        <div className="w-full md:w-64 shrink-0">
          <ProductFilters onFilterChange={handleFilterChange} />
        </div>

        {/* Liste des produits */}
        <div className="flex-1">
          {/* En-tête de liste avec options */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-4">
              <ProductSearchBar onSearch={handleSearch} searchTerm={searchTerm} />
              <ProductViewToggle view={viewMode} onViewChange={setViewMode} />
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {filteredProducts.length} produits
              </span>
              <ProductSort onSortChange={handleSortChange} selectedSort={sortBy} />
            </div>
          </div>

          {/* Grille de produits */}
          <div className={`grid ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"} gap-6`}>
            {currentProducts.map((product) => (
              <div key={product.id} className="group relative">
                <div className={`border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow ${
                  viewMode === "list" ? "flex items-start" : ""
                }`}>
                  {/* Image du produit */}
                  <Link 
                    to={`/products/detail/${product.id}`}
                    className={`block overflow-hidden ${viewMode === "list" ? "w-40 shrink-0" : "aspect-square"}`}
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" 
                    />
                  </Link>
                  
                  {/* Informations produit */}
                  <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <Link to={`/products/detail/${product.id}`}>
                      <h3 className="font-medium text-gray-900 group-hover:text-accent transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    
                    {/* Note et avis */}
                    <div className="flex items-center mt-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-current" : "fill-gray-300"}`} 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-1 text-xs text-gray-500">({product.reviewCount})</span>
                    </div>
                    
                    {/* Prix */}
                    <div className="mt-2 flex items-center">
                      <span className="text-accent font-bold">{product.price.toFixed(2)} €</span>
                      {product.originalPrice && (
                        <>
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            {product.originalPrice.toFixed(2)} €
                          </span>
                          <span className="ml-2 text-xs font-medium text-green-600">
                            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                          </span>
                        </>
                      )}
                    </div>
                    
                    {/* Description courte pour la vue en liste */}
                    {viewMode === "list" && product.description && (
                      <p className="mt-2 text-sm text-gray-500 line-clamp-2">{product.description}</p>
                    )}
                    
                    {/* Actions rapides */}
                    <div className={`mt-3 flex items-center gap-2 ${viewMode === "list" ? "" : "opacity-0 group-hover:opacity-100 transition-opacity"}`}>
                      <button className="p-1.5 rounded-full bg-accent/10 hover:bg-accent/20 text-accent" title="Ajouter au panier">
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700" title="Ajouter aux favoris">
                        <Heart className="w-4 h-4" />
                      </button>
                      <Link to={`/products/detail/${product.id}`} className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700" title="Voir détails">
                        <Search className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Badge de nouveauté ou promo */}
                {product.isNew && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                    Nouveau
                  </div>
                )}
                {product.originalPrice && (
                  <div className="absolute top-2 right-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded">
                    Promo
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="join">
                <button 
                  className="join-item btn btn-sm border border-gray-300 disabled:opacity-50"
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  «
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`join-item btn btn-sm ${
                      currentPage === i + 1 
                        ? "bg-accent text-white border-accent" 
                        : "border border-gray-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button 
                  className="join-item btn btn-sm border border-gray-300 disabled:opacity-50"
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
