
import React from 'react';

interface ProductPaginationControlsProps {
  currentPage: number;
  totalPages: number;
  paginate: (pageNumber: number) => void;
}

const ProductPaginationControls = ({ 
  currentPage, 
  totalPages, 
  paginate 
}: ProductPaginationControlsProps) => {
  if (totalPages <= 1) return null;
  
  return (
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
  );
};

export default ProductPaginationControls;
