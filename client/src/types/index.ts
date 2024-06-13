export type Pair = {
  key: number,
  value: string,
  label: string
}

export type OrderBook = {
    [key: string]: {
      volume: number;
      rate: number;
      price: number;
    }
}

export type GraphData = {
  close: number
  high: number
  low: number
  open: number
  pair: string
  pair_id: number
  time:number
  volume:number
}

export type Price = {
  time: number,
  open: number,
  high: number,
  low: number,
  close: number
}

export type Volume = {
  time: number,
  volume: number
}

export type History = {
  time_create: number,
  type: number,
  price: number,
  pair: string
}