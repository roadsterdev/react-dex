import { BrowserRouter } from "react-router-dom";
import { useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import Router from "./routes";
import { socket } from "./socket";
import { useAppContext } from "./context/AppContext";
import { convertMillisecondsToDate } from "./utils/convertMillisecondsToDate";
import { useSessionStorageContext } from "./context/SessionStorageContext";
import { GraphData } from "./types";

function App() {
  const { appState, appDispatch } = useAppContext();
  const { candleSticks, setCandleSticks } = useSessionStorageContext();

  const processGraphData = useCallback((graphData: string) => {
    const data = JSON.parse(graphData).data;
    const lastData = Array.isArray(data) ? data[data.length - 1] : data;
    const current = lastData.close / 1e8;

    appDispatch({ type: "SET_CURRENT", payload: current });

    const processItem = (item: GraphData) => ({
      ...item,
      high: item.high / 1e8,
      low: item.low / 1e8,
      open: item.open / 1e8,
      close: item.close / 1e8,
      volume: item.high / 1e8,
    });

    if (Array.isArray(data)) {
      const _data = data.map(processItem).sort((a, b) => a.time - b.time);
      setCandleSticks(_data);
    } else {
      const index = candleSticks.findIndex((item) => item.time === data.time);
      const processedData = processItem(data);

      if (index > -1) {
        if (candleSticks[index].close !== data.close) {
          setCandleSticks([
            ...candleSticks.slice(0, index),
            processedData,
            ...candleSticks.slice(index + 1),
          ]);
        }
      } else {
        setCandleSticks(
          [...candleSticks, processedData].sort((a, b) => a.time - b.time)
        );
      }
    }

    const orderToBeFilled = appState.orders
      .filter((order) => order.price === current)
      .sort((a, b) => a.created_date - b.created_date)[0];

    if (orderToBeFilled) {
      appDispatch({ type: "FILL_ORDER", payload: orderToBeFilled });

      const msg = `Order that is created at ${convertMillisecondsToDate(
        orderToBeFilled.created_date
      )}(${orderToBeFilled.type} ${orderToBeFilled.ticker}) has been filled!`;
      toast.success(msg);
    }
  }, [appDispatch, appState.orders, candleSticks]);

  useEffect(() => {
    socket.on("graph", processGraphData);
    return () => {
      socket.off("graph", processGraphData);
    };
  }, [processGraphData]);

  return (
    <BrowserRouter>
      <Router />
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
