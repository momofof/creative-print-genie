
import React from "react";
import CategoryCard from "./CategoryCard";

interface Category {
  id: string;
  title: string;
  image: string;
  subcategories: string[];
}

interface CategoryGridProps {
  categories: Category[];
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  return (
    <section className="py-8 mb-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <CategoryCard 
              key={category.id}
              id={category.id}
              title={category.title}
              image={category.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
