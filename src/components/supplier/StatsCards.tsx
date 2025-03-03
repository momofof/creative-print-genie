
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stat } from "@/types/dashboard";

interface StatsCardsProps {
  stats: Stat[];
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className={`text-sm mt-1 ${
              stat.changeType === 'positive' ? 'text-green-600' : 
              stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
            }`}>
              {stat.change} depuis le mois dernier
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
