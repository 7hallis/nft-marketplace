
import { api } from "./client";

export interface CreateOrderItem {
  id: string;
  quantity: number;
}

export interface CreateOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface CreateOrderData {
  items: CreateOrderItem[];
  wallet: string;
  network: string;
  walletAddress: string;
  walletType: string;
  displayName: string;
  username: string;
  profileName: string;
  email: string;
  secondaryWallet?: string;
  referralCode?: string;
  ensName?: string;
  observation?: string;
  promoCode?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  status: "confirmed";
  subtotal: number;
  discount: number;
  networkFee: number;
  total: number;
  wallet: string;
  network: string;
  walletAddress: string;
  items: OrderItem[];
}

export async function createOrder(data: CreateOrderData) {
  const response = await api.post<Order>("/orders", data);
  return response.data;
}

export async function getOrders() {
  const response = await api.get<Order[]>("/orders");
  return response.data;
}

export async function getOrder(id: string) {
  const response = await api.get<Order>(
    `/orders/${encodeURIComponent(id)}`,
  );
  return response.data;
}
