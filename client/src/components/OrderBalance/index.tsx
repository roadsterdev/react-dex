import { useAppContext } from "../../context/AppContext";
import { OrderAction } from "../../types";

const Balance = ({ action }: { action: OrderAction }) => {
  const { appState } = useAppContext();

  return (
    <div className="flex items-center gap-2 text-black">
      <svg
        className="icon_custom_component"
        width="16"
        height="16"
        viewBox="0 0 16 16"
      >
        <path d="M12.667 2c1.416 0 2.574 1.104 2.661 2.498l.005.169v6.667c0 1.416-1.104 2.574-2.498 2.661l-.169.005H3.334C1.918 14 .759 12.896.672 11.502l-.005-.169V4.667c0-1.416 1.104-2.574 2.498-2.661L3.334 2h9.333zm0 1.333H3.334C2.597 3.333 2 3.93 2 4.667v6.667c0 .736.597 1.333 1.333 1.333h9.333c.736 0 1.333-.597 1.333-1.333h-2c-1.841 0-3.333-1.492-3.333-3.333S10.159 4.667 12 4.667h2c0-.736-.597-1.333-1.333-1.333zM14 6h-2a2 2 0 0 0 0 4h2V6zm-2 1.333c.368 0 .667.298.667.667s-.298.667-.667.667-.667-.298-.667-.667.298-.667.667-.667z"></path>
      </svg>
      <div className="flex items-center gap-1">
        <p className="text-sm">
          {action === "buy"
            ? appState.balance.USDT
            : appState.balance[appState.pair.ticker]}
        </p>
        <p className="text-sm">
          {action === "buy" ? "USDT" : appState.pair.ticker}
        </p>
      </div>
    </div>
  );
};

export default Balance;
