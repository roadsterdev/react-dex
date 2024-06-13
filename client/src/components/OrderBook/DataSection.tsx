import { OrderBook } from "../../types"

interface OrderBookSectionProps {
  type: 'buy' | 'sell'
  data: OrderBook[]
}

const OrderBookSection = ({ type, data }: OrderBookSectionProps) => {
  return (
    <div className="font-semibold min-h-[344px] min-w-[270px]">
      <div className="text-sm">{ type === 'buy' ? 'Ask' : 'Bid' }</div>
      <div className="flex flex-col gap-1.5">
        {data.map((item, index) => {
          const { rate, volume, price } = item[Object.keys(item)[0]]
          return (
            <div key={index} className="flex text-xs">
              <div className={`w-[80px] ${type === 'buy' ? 'text-red' : 'text-green'}`}>{rate}</div>
              <div className="w-[80px] text-right">{volume}</div>
              <div className="w-[110px] text-right">{price.toFixed(2)}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OrderBookSection