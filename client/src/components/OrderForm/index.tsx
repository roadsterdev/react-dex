import Slider from 'rc-slider';
import { ChangeEvent, useMemo, useState } from 'react';

import { useAppContext } from '../../context/appContextProvider';

import 'rc-slider/assets/index.css';

const OrderForm = ({ orderType }: { orderType: string }) => {
  const { appState } = useAppContext()

  const [data, setData] = useState({
    price: '',
    amount: '',
  })

  const currentType = useMemo(() => {
    return appState.pair.label.split('/')[0]
  }, [appState.pair])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className='flex flex-col gap-4 font-semibold text-gray text-sm'>
      <p className='text-lg text-black'>{orderType === 'buy' ? 'Buy' : 'Sell'}</p>
      <div className="flex items-center gap-2 border border-lightGray rounded-lg p-2">
        <p className="price">Price</p>
        <input className='border-none outline-none text-black text-right' name='price' value={data.price} onChange={handleChange} />
        <p className="unit">USDT</p>
      </div>
      <div className="flex items-center gap-2 border border-lightGray rounded-lg p-2">
        <p className="amount">Amount</p>
        <input className='outline-none text-right text-black' name='amount' value={data.amount} onChange={handleChange}/>
        <p className="unit">{currentType}</p>
      </div>
      <Slider range step={25} />
      <div className="flex items-center gap-2 border border-lightGray rounded-lg p-2">
        <p className="price">Total</p>
        <input className='outline-none text-right text-black'/>
        <p className="unit">USDT</p>
      </div>
      <button className={`text-white font-semibold ${orderType === 'buy' ? 'bg-green' : 'bg-red'}`}>
        {`Limit ${orderType === 'buy' ? 'Buy' : 'Sell'} ${currentType}`}
      </button>
    </div>
  )
}

export default OrderForm