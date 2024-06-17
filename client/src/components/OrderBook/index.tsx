import { useEffect, useState, useCallback } from 'react';

import OrderBookSection from './DataSection';
import { useAppContext } from '../../context/AppContext';
import { socket } from '../../socket';
import { OrderBook } from '../../types';

const OrderBooks = () => {
  const { appState } = useAppContext()

  const [buyData, setBuyData] = useState<OrderBook[]>([]);
  const [sellData, setSellData] = useState<OrderBook[]>([]);

  const handleNewData = useCallback((newData: OrderBook) => {
    return (prevData: OrderBook[]) => {
      const key = Object.keys(newData)[0];
      const index = prevData.findIndex(item => Object.keys(item)[0] === key);

      let newDataArray = prevData.slice();
      if (index > -1) {
        newDataArray[index] = newData;
      } else {
        newDataArray = [...prevData, newData];
        if (newDataArray.length > 15) {
          newDataArray.shift();
        }
      }
      return newDataArray;
    };
  }, []);

  useEffect(() => {
    setBuyData([])
    setSellData([])
  }, [appState.pair])

  useEffect(() => {
    socket.on('book', data => {
      const parsedData = JSON.parse(data);
      const type = Object.keys(parsedData)[0]; // 'buy' or 'sell'
      const key = Object.keys(parsedData[type])[0];

      const newData: OrderBook = {
        [key]: {
          rate: parsedData[type][key].rate / 100000000,
          volume: parsedData[type][key].volume / 100000000,
          price: parsedData[type][key].price / 100000000,
        }
      };

      if (type === 'buy') {
        setBuyData(handleNewData(newData));
      } else {
        setSellData(handleNewData(newData));
      }
    });

    return () => {
      socket.off('book')
    }
  }, [handleNewData]);

  return (
    <div className="order-books flex flex-col gap-6">
      <OrderBookSection type='buy' data={buyData} />
      <OrderBookSection type='sell' data={sellData} />
    </div>
  );
};

export default OrderBooks;
