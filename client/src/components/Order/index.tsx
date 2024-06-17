import clsx from "clsx";

import OrderForm from "../OrderForm";
import { useOrderContext } from "../../context/OrderContext";

const Order = () => {
  const { orderType, setOrderType } = useOrderContext()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-xs">
        <button
          className={clsx(
            "px-3 py-1.5 font-semibold outline-none",
            orderType === "limit" ? "bg-[#e6e8ec] text-blue " : "bg-white"
          )}
          onClick={() => setOrderType("limit")}
        >
          Limit
        </button>
        <button
          className={clsx(
            "px-3 py-1.5 font-semibold outline-none",
            orderType === "market" ? "bg-[#e6e8ec] text-blue " : "bg-white"
          )}
          onClick={() => setOrderType("market")}
        >
          Market
        </button>
      </div>
      <div className="flex gap-8">
        <OrderForm action="buy" />
        <OrderForm action="sell" />
      </div>
    </div>
  );
};

export default Order;
