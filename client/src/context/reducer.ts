import { useReducer } from "react";
import { AppAction, AppState } from "./types";
import { pairs } from "../utils/constants";

const initialState: AppState = {
  pair: pairs[0],
  current: null
}

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_PAIR': 
      return {
        ...state,
        pair: action.payload
      }
    case 'SET_CURRENT':
      return {
        ...state,
        current: action.payload
      }
    default:
      return state;
  }
}

export const useAppReducer = (): [AppState, React.Dispatch<AppAction>] => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return [state, dispatch]
}