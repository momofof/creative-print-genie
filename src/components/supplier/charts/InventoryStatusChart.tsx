
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryStatusData } from "@/types/dashboard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface InventoryStatusChartProps {
  data: InventoryStatusData[];
  title: string;
  description?: string;
}

const STATUS_COLORS = {
  'En stock': '#10b981',
  'Stock faible': '#f97316',
  'Rupture de stock': '#ef4444'
};

const InventoryStatusChart: React.FC<InventoryStatusChartProps> = ({ data, title, description }) => {
  return (
    <Card>
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
                dataKey="status" 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                formatter={(value) => [`${value} produits`]}
                labelFormatter={(label) => `Statut: ${label}`}
              />
              <Bar dataKey="count">
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS] || '#10b981'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-gray-500">Aucune donnée d'inventaire disponible</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryStatusChart;
