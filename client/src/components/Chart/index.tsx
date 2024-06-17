import { createChart } from 'lightweight-charts';
import { useEffect, useRef } from 'react';

import { useSessionStorageContext } from '../../context/SessionStorageContext';

const Chart = () => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null)

  const { candleSticks } = useSessionStorageContext()

  useEffect(() => {
    if (chartContainerRef.current) {
      while (chartContainerRef.current.firstChild) {
        chartContainerRef.current?.removeChild(chartContainerRef.current.firstChild);
      }
      const chartOptions: any = {
        layout: {
          textColor: 'black',
          background: { type: 'solid', color: 'white' }
        }
      };
      const chart = createChart(chartContainerRef.current, chartOptions);
     
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });

      candlestickSeries.setData([...candleSticks]);

      chart.timeScale().fitContent();
    }
  }, [chartContainerRef, candleSticks]);

  return (
    <div id="container" ref={chartContainerRef} style={{ height: '400px', width: '100%' }}></div>
  );
};

export default Chart;
