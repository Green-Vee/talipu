export interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  stockStatus: string;
  image: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  time: string;
  type: "warning" | "info" | "success";
  read: boolean;
}
