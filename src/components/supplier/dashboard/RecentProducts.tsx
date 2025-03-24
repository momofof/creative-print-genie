
import React from "react";
import { ProductComplete } from "@/types/dashboard";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RecentProductsProps {
  products: ProductComplete[];
  onEditProduct: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
}

const RecentProducts = ({ 
  products, 
  onEditProduct, 
  onDeleteProduct 
}: RecentProductsProps) => {
  // Display only the 5 most recent products
  const recentProducts = [...products]
    .sort((a, b) => new Date(b.updated_at || "").getTime() - new Date(a.updated_at || "").getTime())
    .slice(0, 5);

  if (recentProducts.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-semibold text-lg mb-4">Produits récents</h3>
        <p className="text-gray-500 text-center py-4">
          Vous n'avez pas encore de produits. Commencez par en ajouter un !
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border">
      <h3 className="font-semibold text-lg p-4 border-b">Produits récents</h3>
      <div className="divide-y">
        {recentProducts.map((product) => (
          <div key={product.id} className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src={product.image || "/placeholder.svg"} 
                alt={product.name} 
                className="w-10 h-10 rounded object-cover"
              />
              <div>
                <h4 className="font-medium text-sm">{product.name}</h4>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant={product.status === "published" ? "default" : "secondary"} className="text-xs">
                    {product.status === "published" ? "Actif" : 
                     product.status === "draft" ? "Brouillon" : "Archivé"}
                  </Badge>
                  <span className="text-sm text-gray-500">{product.price.toFixed(2)} €</span>
                </div>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <MoreHorizontal className="h-4 w-4 text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEditProduct(product.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  <span>Modifier</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDeleteProduct(product.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  <span>Supprimer</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentProducts;
