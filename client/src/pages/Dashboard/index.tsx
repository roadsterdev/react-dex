import Chart from "../../components/Chart";
import OrderHistory from "../../components/OrderHistory";
import Order from "../../components/Order";
import OrderBook from "../../components/OrderBook";
import PairSelector from "../../components/PairSelector";
import { OrderContextProvider } from "../../context/OrderContext";
import UserBalance from "../../components/UserBalance";

const Dashboard = () => {
  return (
    <>
      <div className="px-20 mt-20">
        <div className="flex items-center justify-between gap-10">
          <PairSelector />
          <UserBalance />
        </div>
        <div className="flex-1 flex gap-10 py-4 border-t-4 border-lightGray">
          <OrderBook />
          <div className="flex-1 flex flex-col gap-6">
            <Chart />
            <OrderContextProvider>
              <Order />
            </OrderContextProvider>
          </div>
        </div>
        <div className="mt-4">
          <OrderHistory />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
