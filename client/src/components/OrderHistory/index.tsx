import clsx from "clsx";
import { useAppContext } from "../../context/AppContext";
import { convertMillisecondsToDate } from "../../utils/convertMillisecondsToDate";

const TradeHistory = () => {
  const { appState, appDispatch } = useAppContext();

  const handleCancelOrder = (index: number) => {
    appDispatch({
      type: 'CANCEL_ORDER',
      payload: index
    })
  }

  return (
    <div className="text-sm py-10">
      <div className="text-lg my-1">Order History</div>
      <table className="border-collapse border border-lightGray w-full">
        <thead>
          <tr>
            <th className="border border-lightGray px-12 py-2">Pair</th>
            <th className="border border-lightGray px-12 py-2">Type</th>
            <th className="border border-lightGray px-12 py-2">Price</th>
            <th className="border border-lightGray px-12 py-2">Quantity</th>
            <th className="border border-lightGray px-12 py-2">Total</th>
            <th className="border border-lightGray px-12 py-2">Created Date</th>
            <th className="border border-lightGray px-12 py-2">
              Completed Date
            </th>
            <th className="border border-lightGray px-12 py-2">Status</th>
            <th className="border border-lightGray px-12 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {appState.orders.map((order, index) => (
            <tr key={index} className="text-center">
              <td className="border border-lightGray py-2">
                {order.ticker}
              </td>
              <td className="border border-lightGray py-2">
                {order.type === 'buy' ? 'Buy' : 'Sell'}
              </td>
              <td className="border border-lightGray py-2">
                {order.price}
              </td>
              <td className="border border-lightGray py-2">
                {order.quantity}
              </td>
              <td className="border border-lightGray py-2">
                {order.total}
              </td>
              <td className="border border-lightGray py-2">
                {convertMillisecondsToDate(order.created_date)}
              </td>
              <td className="border border-lightGray py-2">
                {convertMillisecondsToDate(order.completed_date)}
              </td>
              <td className="border border-lightGray py-2">
                {order.status}
              </td>
              <td className="border border-lightGray py-2">
                <button
                  className={clsx(
                    'text-xs py-1 px-3 rounded-sm bg-red text-white',
                    order.status !== "Pending" && "opacity-50"
                  )}
                  onClick={() => handleCancelOrder(index)}
                  disabled={order.status !== "Pending"}
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TradeHistory;
