
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AnalyticsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Ventes mensuelles</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-center text-gray-500">Graphique d'analyse des ventes mensuelles</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Produits populaires</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-center text-gray-500">Graphique des produits les plus vendus</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsCards;
