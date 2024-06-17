import { useState, useContext, createContext, ReactNode } from "react";

type OrderType = 'limit' | 'market'

interface OrderContextType {
  orderType: OrderType,
  setOrderType: (type: OrderType) => void
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export const OrderContextProvider = ({ children }: { children: ReactNode }) => {
  const [orderType, setOrderType] = useState<OrderType>('limit')

  return (
    <OrderContext.Provider value={{ orderType, setOrderType }}>
      {children}
    </OrderContext.Provider>
  )
}

export const useOrderContext = (): OrderContextType => {
  const context = useContext(OrderContext)

  if (!context) {
    throw new Error('useOrderContext must be used within Provider')
  }

  return context
}