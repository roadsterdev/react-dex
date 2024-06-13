import Chart from "../../components/Chart";
import TradeHistory from "../../components/History";
import OrderBook from "../../components/OrderBook";
import OrderForm from "../../components/OrderForm";
import PairSelector from "../../components/PairSelector";

const Dashboard = () => {
  return (
    <>
      <div className="px-20 mt-20">
        <PairSelector />
        <div className="flex-1 flex gap-10 py-2 border-t-4 border-lightGray">
          <OrderBook />
          <div className="flex-1 flex flex-col gap-6">
            <Chart />
            <div className="flex gap-8">
              <OrderForm orderType="buy" />
              <OrderForm orderType="sell"/>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <TradeHistory />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
