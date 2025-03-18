
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
}

interface RecentProductsProps {
  products: Product[];
}

const RecentProducts = ({ products }: RecentProductsProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Produits récents</CardTitle>
          <Link to="/supplier/products">
            <Button variant="ghost" size="sm">
              Voir tous
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-3 font-medium text-gray-500">Nom</th>
                  <th className="pb-3 font-medium text-gray-500">Catégorie</th>
                  <th className="pb-3 font-medium text-gray-500">Prix</th>
                  <th className="pb-3 font-medium text-gray-500">Statut</th>
                  <th className="pb-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">{product.name}</td>
                    <td className="py-3">{product.category}</td>
                    <td className="py-3">{product.price} €</td>
                    <td className="py-3">
                      <span 
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          product.status === 'published' 
                            ? 'bg-green-100 text-green-800'
                            : product.status === 'draft'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.status === 'published' 
                          ? 'Publié' 
                          : product.status === 'draft'
                          ? 'Brouillon'
                          : 'Archivé'
                        }
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        <Link to={`/supplier/product/${product.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Modifier
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 mb-4">Vous n'avez pas encore de produits</p>
            <Link to="/supplier/product/new">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter un produit
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentProducts;
