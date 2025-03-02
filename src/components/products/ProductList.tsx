
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { allProducts } from "@/data/productData";
import ProductFilters from "./ProductFilters";
import ProductEmptyState from "./ProductEmptyState";
import ProductGrid from "./ProductGrid";
import ProductListHeader from "./ProductListHeader";
import PaginationControls from "./PaginationControls";

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
          return new Date(b.date || Date.now()).getTime() - new Date(a.date || Date.now()).getTime();
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
    return <ProductEmptyState />;
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
          <ProductListHeader 
            searchTerm={searchTerm}
            onSearch={handleSearch}
            viewMode={viewMode}
            onViewChange={setViewMode}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            totalProducts={filteredProducts.length}
          />

          {/* Grille de produits */}
          <ProductGrid products={currentProducts} viewMode={viewMode} />
          
          {/* Pagination */}
          <PaginationControls 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={paginate} 
          />
        </div>
      </div>
    </div>
  );
};

export default ProductList;
