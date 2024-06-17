import clsx from "clsx";
import { useAppContext } from "../../context/AppContext";
import { useOrderContext } from "../../context/OrderContext";
import { OrderAction } from "../../types";

interface OrderButtonProps {
  action: OrderAction;
  onClick: () => void;
  disabled: boolean
}

const OrderButton = ({ action, onClick, disabled }: OrderButtonProps) => {
  const { appState } = useAppContext();
  const { orderType } = useOrderContext();

  return (
    <button
      className={clsx(
        "text-white font-semibold",
        action === "buy" ? "bg-green" : "bg-red",
        disabled && "opacity-50"
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {`${orderType === "limit" ? "Limit" : "Market"} ${
        action === "buy" ? "Buy" : "Sell"
      } ${appState.pair.ticker}`}
    </button>
  );
};

export default OrderButton;
