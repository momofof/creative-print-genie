
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import CategoryIcon from "./CategoryIcon";

interface CategoryCardProps {
  id: string;
  title: string;
  image: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ id, title, image }) => {
  return (
    <Link 
      to={`/products/${id}`}
      className="group"
    >
      <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
        <div className="aspect-square w-full relative overflow-hidden">
          <img 
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <div className="mb-2 text-teal-600">
            <CategoryIcon categoryId={id} />
          </div>
          <h3 className="text-sm font-medium text-center">{title}</h3>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryCard;
