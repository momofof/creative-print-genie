
import { Package, ShoppingBag, Settings, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProductStatsProps {
  totalProducts: number;
  publishedProducts: number;
  draftProducts: number;
  archivedProducts: number;
}

const ProductStats = ({ 
  totalProducts, 
  publishedProducts, 
  draftProducts, 
  archivedProducts 
}: ProductStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total des produits</p>
              <h3 className="text-2xl font-bold">{totalProducts}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Produits publiés</p>
              <h3 className="text-2xl font-bold">{publishedProducts}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <ShoppingBag className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Brouillons</p>
              <h3 className="text-2xl font-bold">{draftProducts}</h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Settings className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Archivés</p>
              <h3 className="text-2xl font-bold">{archivedProducts}</h3>
            </div>
            <div className="bg-gray-100 p-3 rounded-full">
              <BarChart3 className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductStats;
