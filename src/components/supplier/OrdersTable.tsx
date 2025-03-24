
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderComplete } from "@/types/dashboard";

interface OrdersTableProps {
  orders: OrderComplete[];
  isCompact?: boolean;
  onViewAllOrders?: () => void;
}

const OrdersTable = ({ orders, isCompact = false, onViewAllOrders }: OrdersTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-3 font-medium">Commande</th>
            <th className="pb-3 font-medium">Client</th>
            <th className="pb-3 font-medium">Date</th>
            {!isCompact && <th className="pb-3 font-medium">Articles</th>}
            <th className="pb-3 font-medium">Montant</th>
            <th className="pb-3 font-medium">Statut</th>
            {!isCompact && <th className="pb-3 font-medium">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="py-3">{order.id}</td>
                <td className="py-3">{order.customer_name || "Client invité"}</td>
                <td className="py-3">{new Date(order.created_at || "").toLocaleDateString()}</td>
                {!isCompact && <td className="py-3">{order.product_quantity || 0}</td>}
                <td className="py-3">{order.total.toFixed(2)} €</td>
                <td className="py-3">
                  <Badge variant={
                    order.status === "delivered" ? "default" :
                    order.status === "processing" ? "secondary" : "outline"
                  }>
                    {order.status === "delivered" ? "Livré" :
                    order.status === "processing" ? "En traitement" : "Expédié"}
                  </Badge>
                </td>
                {!isCompact && (
                  <td className="py-3">
                    <Button variant="outline" size="sm">Détails</Button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={isCompact ? 6 : 7} className="py-4 text-center text-gray-500">
                Aucune commande trouvée.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {isCompact && onViewAllOrders && (
        <div className="mt-4">
          <Button variant="outline" className="w-full" onClick={onViewAllOrders}>
            Voir toutes les commandes
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
