export type Pair = {
  key: number;
  ticker: string;
};

export type OrderBook = {
  [key: string]: {
    volume: number;
    rate: number;
    price: number;
  };
};

export type GraphData = {
  close: number;
  high: number;
  low: number;
  open: number;
  pair: string;
  pair_id: number;
  time: number;
  volume: number;
};

export type Price = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

export type Volume = {
  time: number;
  volume: number;
};

export type History = {
  time_create: number;
  type: number;
  price: number;
  pair: string;
};

export type OrderStatus = "Pending" | "Filled" | "Canceled";

export type Order = {
  ticker: string;
  type: OrderAction;
  price: number;
  quantity: number;
  total: number;
  created_date: number;
  completed_date?: number;
  status: OrderStatus;
};

export type OrderAction = "buy" | "sell";
