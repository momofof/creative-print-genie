
import { Order } from "@/types/dashboard";

// Simulate orders (to be replaced with a real API)
export const simulateOrders = (): Order[] => {
  const mockOrders: Order[] = [
    {
      id: "ORD-39285",
      customer: "Jean Dupont",
      date: "2023-09-23",
      total: 79.98,
      status: "delivered",
      items: 2
    },
    {
      id: "ORD-38104",
      customer: "Marie Lambert",
      date: "2023-09-21",
      total: 129.97,
      status: "processing",
      items: 3
    },
    {
      id: "ORD-37490",
      customer: "Thomas Martin",
      date: "2023-09-18",
      total: 49.99,
      status: "shipped",
      items: 1
    }
  ];
  
  return mockOrders;
};
