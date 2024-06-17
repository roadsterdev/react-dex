import { useReducer } from "react";
import { AppAction, AppState } from "./types";
import { pairs } from "../../utils/constants";
import { Order, OrderAction, OrderStatus } from "../../types";

const initialState: AppState = {
  balance: {
    USDT: 100000,
    BTC: 0,
    LTC: 0,
    XRP: 0,
  },
  pair: pairs[0],
  current: null,
  orders: [],
  graphData: [],
};

const updateBalance = (
  balance: any,
  type: OrderAction,
  total: number,
  quantity: number,
  ticker: string,
  status: OrderStatus
) => {
  const updatedBalance = { ...balance };

  if (type === "buy") {
    updatedBalance.USDT += status === "Canceled" ? total : -total;
    if (status === "Filled")
      updatedBalance[ticker] = (updatedBalance[ticker] || 0) + quantity;
  } else {
    updatedBalance[ticker] += status === "Canceled" ? quantity : -quantity;
    if (status === "Filled") updatedBalance.USDT += total;
  }

  return updatedBalance;
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "SET_BALANCE": {
      const { key, value } = action.payload;
      return {
        ...state,
        balance: {
          ...state.balance,
          [key]: value,
        },
      };
    }
    case "SET_PAIR":
      return {
        ...state,
        pair: action.payload,
      };
    case "SET_CURRENT":
      return {
        ...state,
        current: action.payload,
      };
    case "ADD_ORDER": {
      const newOrder = action.payload;
      return {
        ...state,
        balance: updateBalance(
          state.balance,
          newOrder.type,
          newOrder.total,
          newOrder.quantity,
          state.pair.ticker,
          newOrder.status
        ),
        orders: [...state.orders, newOrder],
      };
    }
    case "FILL_ORDER": {
      const orderToBeFilled = action.payload;

      const index = state.orders.findIndex(
        (order) => order.created_date === orderToBeFilled.created_date
      );

      const filledOrder: Order = {
        ...orderToBeFilled,
        completed_date: new Date().getTime(),
        status: "Filled",
      };

      return {
        ...state,
        balance: updateBalance(
          state.balance,
          filledOrder.type,
          filledOrder.total,
          filledOrder.quantity,
          state.pair.ticker,
          filledOrder.status
        ),
        orders: [
          ...state.orders.slice(0, index),
          filledOrder,
          ...state.orders.slice(index + 1),
        ],
      };
    }
    case "CANCEL_ORDER": {
      const canceledOrderIndex = action.payload;
      const canceledOrder: Order = {
        ...state.orders[canceledOrderIndex],
        status: "Canceled",
      };

      return {
        ...state,
        balance: updateBalance(
          state.balance,
          state.orders[canceledOrderIndex].type,
          state.orders[canceledOrderIndex].total,
          state.orders[canceledOrderIndex].quantity,
          state.pair.ticker,
          canceledOrder.status
        ),
        orders: [
          ...state.orders.slice(0, canceledOrderIndex),
          canceledOrder,
          ...state.orders.slice(canceledOrderIndex + 1),
        ],
      };
    }
    default:
      return state;
  }
};

export const useAppReducer = (): [AppState, React.Dispatch<AppAction>] => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return [state, dispatch];
};
