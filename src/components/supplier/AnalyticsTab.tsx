
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SalesChart from "./charts/SalesChart";
import CategorySalesChart from "./charts/CategorySalesChart";
import InventoryStatusChart from "./charts/InventoryStatusChart";
import ProductPerformanceChart from "./charts/ProductPerformanceChart";
import { SalesData, CategorySalesData, InventoryStatusData, MultiSeriesChartData } from "@/types/dashboard";

interface AnalyticsTabProps {
  salesData: SalesData[];
  categorySalesData: CategorySalesData[];
  inventoryStatusData: InventoryStatusData[];
  productPerformanceData: MultiSeriesChartData[];
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ 
  salesData, 
  categorySalesData, 
  inventoryStatusData, 
  productPerformanceData 
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Analyses</h2>
      
      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="sales">Ventes</TabsTrigger>
          <TabsTrigger value="products">Produits</TabsTrigger>
          <TabsTrigger value="inventory">Inventaire</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SalesChart 
              data={salesData} 
              title="Évolution des ventes" 
              description="Ventes mensuelles sur les 6 derniers mois" 
            />
            <CategorySalesChart 
              data={categorySalesData} 
              title="Ventes par catégorie" 
              description="Répartition des ventes par catégorie de produit" 
            />
          </div>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-6">
          <ProductPerformanceChart 
            data={productPerformanceData} 
            title="Performance des produits" 
            description="Ventes et vues des produits les plus populaires" 
          />
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InventoryStatusChart 
              data={inventoryStatusData} 
              title="Statut de l'inventaire" 
              description="Répartition des produits par statut de stock" 
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsTab;
