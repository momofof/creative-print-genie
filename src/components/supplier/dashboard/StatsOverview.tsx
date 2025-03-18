
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Layers, ShoppingBag, Truck } from "lucide-react";

interface SupplierStats {
  totalProducts: number;
  productsInStock: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}

interface StatsOverviewProps {
  stats: SupplierStats;
}

const StatsOverview = ({ stats }: StatsOverviewProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-full mr-4">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total produits</p>
              <h3 className="text-2xl font-bold">{stats.totalProducts}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-full mr-4">
              <Layers className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">En stock</p>
              <h3 className="text-2xl font-bold">{stats.productsInStock}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-full mr-4">
              <ShoppingBag className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Stock faible</p>
              <h3 className="text-2xl font-bold">{stats.lowStockProducts}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-full mr-4">
              <Truck className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Rupture de stock</p>
              <h3 className="text-2xl font-bold">{stats.outOfStockProducts}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
