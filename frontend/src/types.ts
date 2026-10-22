export interface User {
  id: number;
  name: string;
  points: number;
}
export interface Room {
  id: number;
  name: string;
  capacity: number;
  hourlyPrice: number;
}
export interface Reservation {
  id: number;
  userId: number;
  roomId: number;
  startAt: string;
  endAt: string;
  totalPrice: number;
  pointsUsed: number;
  status: "CONFIRMED" | "CANCELLED";
}
export interface BookingInput {
  roomId: number;
  startAt: string;
  endAt: string;
  totalPrice: number;
  pointsUsed: number;
}
export type Page = "spaces" | "reservations" | "guide";
export type Api = <T>(
  path: string,
  options?: {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
    signal?: AbortSignal;
  },
) => Promise<T>;
export const ACCOUNTS = [
  { name: "민주", token: "alice-demo-token", label: "민주 · Alice" },
  { name: "준호", token: "bob-demo-token", label: "준호 · Bob" },
] as const;
