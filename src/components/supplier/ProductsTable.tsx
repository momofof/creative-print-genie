
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/dashboard";

interface ProductsTableProps {
  products: Product[];
  onEditProduct: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
}

const ProductsTable = ({ products, onEditProduct, onDeleteProduct }: ProductsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-3 font-medium">Produit</th>
            <th className="pb-3 font-medium">Catégorie</th>
            <th className="pb-3 font-medium">Prix</th>
            <th className="pb-3 font-medium">Stock</th>
            <th className="pb-3 font-medium">Statut</th>
            <th className="pb-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={product.image || "/placeholder.svg"} 
                      alt={product.name} 
                      className="w-10 h-10 object-cover rounded-md"
                    />
                    <span>{product.name}</span>
                  </div>
                </td>
                <td className="py-3">{product.category} {product.subcategory ? `/ ${product.subcategory}` : ''}</td>
                <td className="py-3">
                  <div>
                    {product.price.toFixed(2)} €
                    {product.original_price && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        {product.original_price.toFixed(2)} €
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3">
                  <Badge variant={product.stock <= 5 ? "destructive" : "outline"}>
                    {product.stock} en stock
                  </Badge>
                </td>
                <td className="py-3">
                  <Badge variant={product.status === "published" ? "default" : "secondary"}>
                    {product.status === "published" ? "Actif" : 
                     product.status === "draft" ? "Brouillon" : "Archivé"}
                  </Badge>
                </td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEditProduct(product.id)}
                    >
                      Modifier
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => onDeleteProduct(product.id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="py-4 text-center text-gray-500">
                Aucun produit trouvé. Commencez par ajouter un produit !
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;
