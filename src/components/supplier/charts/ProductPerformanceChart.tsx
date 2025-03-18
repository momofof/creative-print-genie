
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiSeriesChartData } from "@/types/dashboard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ProductPerformanceChartProps {
  data: MultiSeriesChartData[];
  title: string;
  description?: string;
}

const ProductPerformanceChart: React.FC<ProductPerformanceChartProps> = ({ data, title, description }) => {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent className="h-80">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                yAxisId="left"
                orientation="left"
                stroke="#10b981"
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                yAxisId="right"
                orientation="right"
                stroke="#3b82f6"
              />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="ventes" name="Ventes (€)" fill="#10b981" />
              <Bar yAxisId="right" dataKey="vues" name="Vues" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-gray-500">Aucune donnée de performance disponible</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductPerformanceChart;
