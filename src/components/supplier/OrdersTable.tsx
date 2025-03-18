
import React from "react";
import { Order } from "@/types/dashboard";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface OrdersTableProps {
  orders: Order[];
  isCompact?: boolean;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, isCompact = false }) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const statusText = {
    pending: "En attente",
    processing: "En traitement",
    shipped: "Expédiée",
    delivered: "Livrée",
    cancelled: "Annulée",
  };

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Commande</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Statut</TableHead>
            {!isCompact && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id.substring(0, 8)}</TableCell>
                <TableCell>
                  {order.customer ? (
                    <div>
                      <div>{order.customer.name}</div>
                      <div className="text-sm text-gray-500">{order.customer.email}</div>
                    </div>
                  ) : (
                    order.customerName
                  )}
                </TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>{order.total.toFixed(2)} €</TableCell>
                <TableCell>
                  <Badge className={statusColors[order.status]}>
                    {statusText[order.status]}
                  </Badge>
                </TableCell>
                {!isCompact && (
                  <TableCell>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Détails
                    </button>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={isCompact ? 5 : 6} className="h-24 text-center text-gray-500">
                Aucune commande à afficher
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersTable;
