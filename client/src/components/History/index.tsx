import { useEffect, useState } from "react"

import { socket } from "../../socket"
import { History } from "../../types"
import { pairs } from "../../utils/constants"
import { convertMillisecondsToDate } from "../../utils/convertMillisecondsToDate"

const TradeHistory = () => {
  const [historyData, setHistoryData] = useState<History[]>([])

  useEffect(() => {
    socket.on('hist', histData => {
      const data = JSON.parse(histData).data

      const exist = historyData.find(item => item.time_create === data.time_create)
      if (!exist) {
        const newData: History = {
          time_create: data.time_create,
          type: data.type,
          price: data.rate,
          pair: pairs.find(item => item.key === data.pair_id)?.label ?? ''
        }
  
        setHistoryData(prev => [
          newData,
          ...prev
        ])
      }
    })

    return () => {
      socket.off('hist')
    }
  }, [])

  return (
    <div className="text-sm py-10">
      <div className="text-lg my-1">Trade History</div>
      <table className="border-collapse border border-lightGray">
        <thead>
          <tr>
            <th className="border border-lightGray px-24 py-2">Time</th>
            <th className="border border-lightGray px-24 py-2">Pair</th>
            <th className="border border-lightGray px-24 py-2">Type</th>
            <th className="border border-lightGray px-24 py-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {historyData.map((hist, index) => (
            <tr key={index}>
              <td className="border border-lightGray px-24 py-2">{convertMillisecondsToDate(hist.time_create)}</td>
              <td className="border border-lightGray px-24 py-2">{hist.pair}</td>
              <td className="border border-lightGray px-24 py-2">{hist.type === 0 ? 'Buy' : 'Sell'}</td>
              <td className="border border-lightGray px-24 py-2">{(hist.price / 10000000).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TradeHistory