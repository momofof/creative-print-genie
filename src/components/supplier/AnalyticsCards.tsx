
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartPie, TrendingUp, BarChart } from "lucide-react";

const AnalyticsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taux de Conversion</CardTitle>
          <TrendingUp className="h-4 w-4 text-teal-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3.2%</div>
          <p className="text-xs text-muted-foreground">+0.5% depuis le mois dernier</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Panier Moyen</CardTitle>
          <BarChart className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">65,40 €</div>
          <p className="text-xs text-muted-foreground">+2.1% depuis le mois dernier</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ratio de Retour</CardTitle>
          <ChartPie className="h-4 w-4 text-indigo-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1.4%</div>
          <p className="text-xs text-muted-foreground">-0.2% depuis le mois dernier</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsCards;
