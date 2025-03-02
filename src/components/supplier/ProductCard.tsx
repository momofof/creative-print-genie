
import { DatabaseProduct, ProductStatus } from "@/types/product";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";

interface ProductCardProps {
  product: DatabaseProduct;
  onStatusChange: (productId: string, newStatus: ProductStatus) => Promise<void>;
}

const ProductCard = ({ product, onStatusChange }: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <Card key={product.id} className="overflow-hidden">
      <div className="h-48 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Package className="h-10 w-10 text-gray-400" />
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{product.name}</CardTitle>
            <CardDescription className="line-clamp-1">
              {product.description || "Aucune description"}
            </CardDescription>
          </div>
          <div className={`px-2 py-1 rounded text-xs font-medium ${
            product.status === "published" ? "bg-green-100 text-green-800" :
            product.status === "draft" ? "bg-yellow-100 text-yellow-800" : 
            "bg-gray-100 text-gray-800"
          }`}>
            {product.status === "published" ? "Publié" :
             product.status === "draft" ? "Brouillon" : "Archivé"}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="flex justify-between items-center mb-2">
          <div className="font-bold text-lg">{product.price.toFixed(2)} €</div>
          {product.originalPrice && (
            <div className="text-sm text-gray-500 line-through">{product.originalPrice.toFixed(2)} €</div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
          <span className="bg-gray-100 px-2 py-1 rounded">{product.category}</span>
          {product.subcategory && (
            <span className="bg-gray-100 px-2 py-1 rounded">{product.subcategory}</span>
          )}
          {product.isCustomizable && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Personnalisable</span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(`/supplier/product/${product.id}/edit`)}
        >
          Modifier
        </Button>
        
        {product.status === "draft" && (
          <Button 
            size="sm" 
            onClick={() => onStatusChange(product.id, "published")}
          >
            Publier
          </Button>
        )}
        
        {product.status === "published" && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onStatusChange(product.id, "archived")}
          >
            Archiver
          </Button>
        )}
        
        {product.status === "archived" && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onStatusChange(product.id, "published")}
          >
            Republier
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
