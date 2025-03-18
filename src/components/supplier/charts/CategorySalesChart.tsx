
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategorySalesData } from "@/types/dashboard";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface CategorySalesChartProps {
  data: CategorySalesData[];
  title: string;
  description?: string;
}

const COLORS = ['#10b981', '#3b82f6', '#f97316', '#8b5cf6', '#ec4899', '#ef4444'];

const CategorySalesChart: React.FC<CategorySalesChartProps> = ({ data, title, description }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent className="h-80">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="sales"
                nameKey="category"
                label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} €`, "Ventes"]} />
              <Legend 
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-gray-500">Aucune donnée de catégorie disponible</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategorySalesChart;
