import { ChangeEvent, useEffect, useState } from "react";

import { pairs } from "../../utils/constants";
import { useAppContext } from "../../context/AppContext";
import { socket } from "../../socket";

const PairSelector = () => {
  const { appState, appDispatch } = useAppContext();
  const [selectedPair, setSelectedPair] = useState<number>(appState.pair.key);

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPair(parseInt(event.target.value));
  };

  useEffect(() => {
    const pair = pairs.find((item) => item.key === selectedPair);

    if (pair) {
      appDispatch({
        type: "SET_PAIR",
        payload: pair,
      });

      socket.emit("pair_changed", JSON.stringify(pair));
    }
  }, [selectedPair, socket]);

  return (
    <div className="flex flex-col items-center w-fit gap-1 px-5 py-2">
      <select
        value={selectedPair}
        onChange={handleSelectChange}
        className="px-3 py-1 border border-none rounded-md text-sm"
      >
        {pairs.map((pair, index) => (
          <option
            key={index}
            value={pair.key}
          >{`${pair.ticker} / USDT`}</option>
        ))}
      </select>
      <p className="text-2xl text-red font-bold">
        {appState.current?.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
    </div>
  );
};

export default PairSelector;
