import { Pair } from "../types"

export interface AppState {
  pair: Pair
  current: number | null
}

interface AppSetPair {
  type: 'SET_PAIR',
  payload: Pair
}

interface AppSetCurrentValue {
  type: 'SET_CURRENT',
  payload: number | null
}

export type AppAction = 
  AppSetPair | AppSetCurrentValue