import { ReactNode, createContext, useContext } from 'react';
import useSessionStorage from './useSessionStorage';

interface SessionStorageContextProps {
  orderBooks: any[];
  setOrderBooks: (value: any[] | ((val: any[]) => any[])) => void;
  candleSticks: any[];
  setCandleSticks: (value: any[] | ((val: any[]) => any[])) => void;
}

const SessionStorageContext = createContext<SessionStorageContextProps | undefined>(undefined);

export const SessionStorageProvider = ({ children }: { children: ReactNode }) => {
  const [orderBooks, setOrderBooks] = useSessionStorage('orderBooks', []);
  const [candleSticks, setCandleSticks] = useSessionStorage('graphData', []);

  return (
    <SessionStorageContext.Provider value={{ orderBooks, setOrderBooks, candleSticks, setCandleSticks }}>
      {children}
    </SessionStorageContext.Provider>
  );
};

export const useSessionStorageContext = () => {
  const sessionStorageContext = useContext(SessionStorageContext);

  if (!sessionStorageContext) {
    throw new Error('error')
  }

  return sessionStorageContext
}