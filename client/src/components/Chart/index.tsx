import React, { useEffect, useRef, memo } from "react";

import { useAppContext } from "../../context/appContextProvider";

const TradingViewWidget: React.FC = () => {
  const { appState } = useAppContext()

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: appState.pair.value,
      interval: "D",
      timezone: "Etc/UTC",
      theme: "light",
      style: "1",
      locale: "en",
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com",
    });
    // @ts-ignore
    while (container.current.firstChild) {
      container.current?.removeChild(container.current.firstChild);
    }
    container.current?.appendChild(script);
  }, [appState.pair]);

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ height: "500px", width: "100%" }}
    >
      <div
        className="tradingview-widget-container__widget"
      ></div>
    </div>
  );
};

export default memo(TradingViewWidget);
