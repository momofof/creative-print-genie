
import React from "react";

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ProductPagination = ({ currentPage, totalPages, onPageChange }: ProductPaginationProps) => {
  // Générateur de pages à afficher
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Cas simple: afficher toutes les pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Cas complexe: afficher certaines pages avec ellipsis
      if (currentPage <= 3) {
        // Proche du début
        for (let i = 1; i <= 3; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Proche de la fin
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i);
      } else {
        // Au milieu
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex justify-center mt-8">
      <div className="flex items-center space-x-1">
        {/* Bouton précédent */}
        <button 
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          Précédent
        </button>
        
        {/* Numéros de page */}
        {getPageNumbers().map((page, index) => (
          typeof page === "number" ? (
            <button
              key={index}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 border rounded-md text-sm ${
                currentPage === page
                  ? "border-accent bg-accent text-white"
                  : "border-gray-300 bg-white hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="px-3 py-2 text-gray-500 text-sm">
              {page}
            </span>
          )
        ))}
        
        {/* Bouton suivant */}
        <button 
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default ProductPagination;
