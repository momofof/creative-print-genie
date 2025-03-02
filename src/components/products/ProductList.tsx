
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { allProducts } from "@/data/productData";
import ProductFilters from "./ProductFilters";
import ProductListHeader from "./ProductListHeader";
import ProductGrid from "./ProductGrid";
import ProductPaginationControls from "./ProductPaginationControls";
import { useProductFiltering } from "@/hooks/useProductFiltering";

interface ProductListProps {
  categoryId?: string;
  subcategoryId?: string;
}

const ProductList = ({ categoryId, subcategoryId }: ProductListProps) => {
  // États pour l'affichage et la pagination
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Utilisation du hook de filtrage
  const {
    filteredProducts,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    handleFilterChange
  } = useProductFiltering({
    allProducts,
    categoryId,
    subcategoryId
  });

  // Gestion de la pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Gestionnaires d'événements
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSortChange = (sortOption: string) => {
    setSortBy(sortOption);
  };

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
          <ProductListHeader 
            searchTerm={searchTerm}
            onSearch={handleSearch}
            viewMode={viewMode}
            onViewChange={setViewMode}
            selectedSort={sortBy}
            onSortChange={handleSortChange}
            productCount={filteredProducts.length}
          />

          {/* Grille de produits */}
          <ProductGrid products={currentProducts} viewMode={viewMode} />
          
          {/* Pagination */}
          <ProductPaginationControls 
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductList;
