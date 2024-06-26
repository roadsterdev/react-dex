import { useRef, useEffect, useMemo } from "react";
import Slider from "rc-slider";
import { ChangeEvent, useState } from "react";

import "rc-slider/assets/index.css";

import { useAppContext } from "../../context/AppContext";
import Balance from "../OrderBalance";
import OrderButton from "../OrderButton";
import { Order, OrderAction } from "../../types";
import { useOrderContext } from "../../context/OrderContext";
import clsx from "clsx";

const OrderForm = ({ action }: { action: OrderAction }) => {
  const { appState, appDispatch } = useAppContext();
  const { orderType } = useOrderContext()

  const isInitialPriceSet = useRef<boolean>(false);

  const [data, setData] = useState({
    price: 0,
    quantity: 0,
    total: 0,
  });

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const price = parseFloat(e.target.value) || 0;
    console.log(price)
    setData((prev) => ({
      ...prev,
      price,
      total: price * prev.quantity,
    }));
  };

  const handlQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const quantity = parseFloat(e.target.value) || 0;
    setData((prev) => ({
      ...prev,
      quantity,
      total: quantity * prev.price,
    }));
  };

  const handleTotalChange = (e: ChangeEvent<HTMLInputElement>) => {
    const total = parseFloat(e.target.value) || 0;
    setData((prev) => ({
      ...prev,
      total,
      quantity: total / prev.price,
    }));
  };

  const cantOrder = useMemo(() => {
    return (
      data.total === 0 ||
      (action === "buy"
        ? appState.balance.USDT === 0 || data.total > appState.balance.USDT
        : appState.balance[appState.pair.ticker] === 0 ||
          appState.balance[appState.pair.ticker] < data.quantity)
    );
  }, [data.total, data.quantity, appState.balance]);

  const handleOrder = () => {
    const order: Order = {
      ...data,
      ticker: appState.pair.ticker,
      type: action,
      created_date: new Date().getTime(),
      status: orderType === 'market' || data.price === appState.current ? 'Filled' : 'Pending'
    }

    appDispatch({
      type: 'ADD_ORDER',
      payload: order
    })

    setData({
      ...data,
      price: appState.current ?? 0,
      quantity: 0,
      total: 0,
    })
  };

  useEffect(() => {
    setData(prev => ({
      ...prev,
      price: appState.current ?? 0
    }))
  }, [appState.current])

  useEffect(() => {
    if (!isInitialPriceSet.current && appState.current) {
      setData((prev) => ({
        ...prev,
        price: appState.current!,
      }));
      isInitialPriceSet.current = true;
    }
  }, [appState.current]);

  return (
    <div className="flex flex-col gap-4 font-semibold text-gray text-sm">
      <div className="flex items-center justify-between">
        <p className="text-lg text-black">
          {action === "buy" ? "Buy" : "Sell"}
        </p>
        <Balance action={action} />
      </div>
      <div className="flex items-center gap-2 border border-lightGray rounded-lg p-2">
        <p className="price">Price</p>
        <input
          type="text"
          name="price"
          className={clsx(
            "border-none outline-none text-black",
            orderType === 'market' ? 'text-center' : 'text-right'
          )}
          value={orderType === 'market' ? 'Market Price' : data.price}
          onChange={handlePriceChange}
          disabled={orderType === 'market'}
        />
        <p className="unit">USDT</p>
      </div>
      <div className="flex items-center gap-2 border border-lightGray rounded-lg p-2">
        <p className="quantity">Quantity</p>
        <input
          type="text"
          name="quantity"
          className="outline-none text-right text-black"
          value={data.quantity}
          onChange={handlQuantityChange}
        />
        <p className="unit">{appState.pair.ticker}</p>
      </div>
      <Slider range step={25} />
      <div className="flex items-center gap-2 border border-lightGray rounded-lg p-2">
        <p className="price">Total</p>
        <input
          type="text"
          name="total"
          className="outline-none text-right text-black"
          value={data.total}
          onChange={handleTotalChange}
        />
        <p className="unit">USDT</p>
      </div>
      <OrderButton action={action} onClick={handleOrder} disabled={cantOrder} />
    </div>
  );
};

export default OrderForm;
