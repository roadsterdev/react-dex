import { GraphData, Order, Pair } from "../../types"

export interface AppState {
  balance: {
    [key: string]: number
  },
  pair: Pair
  current: number | null,
  orders: Order[],
  graphData: GraphData[]
}

interface AppSetBalanceAction {
  type: 'SET_BALANCE',
  payload: {
    key: string,
    value: number
  }
}

interface AppSetPairAction {
  type: 'SET_PAIR',
  payload: Pair
}

interface AppSetCurrentValueAction {
  type: 'SET_CURRENT',
  payload: number | null
}

interface AppAddOrderAction {
  type: 'ADD_ORDER',
  payload: Order
}

interface AppCompleteOrderAction {
  type: 'FILL_ORDER',
  payload: Order
}
 
interface AppCancelOrderAction {
  type: 'CANCEL_ORDER',
  payload: number
}

export type AppAction = 
  AppSetBalanceAction | 
  AppSetPairAction | 
  AppSetCurrentValueAction |
  AppAddOrderAction |
  AppCompleteOrderAction |
  AppCancelOrderAction
