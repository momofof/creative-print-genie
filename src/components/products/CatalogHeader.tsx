
import React from "react";

const CatalogHeader: React.FC = () => {
  return (
    <section className="py-10">
      <div className="container mx-auto text-center">
        <h1 className="text-3xl font-bold mb-2">Nos Produits</h1>
        <p className="text-xl text-gray-600">Sélectionnez une catégorie</p>
      </div>
    </section>
  );
};

export default CatalogHeader;
