import { ChangeEvent, useEffect, useState } from 'react';

import { pairs } from "../../utils/constants";
import { useAppContext } from '../../context/appContextProvider';
import { socket } from '../../socket';

const PairSelector = () => {
  const { appState, appDispatch } = useAppContext()
  const [selectedPair, setSelectedPair] = useState<number>(appState.pair.key);

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPair(parseInt(event.target.value));
  };

  useEffect(() => {
    const pair = pairs.find(item => item.key === selectedPair)

    if (pair) {
      appDispatch({
        type: 'SET_PAIR',
        payload: pair
      })
      
      socket.emit('pair_changed', selectedPair);
    }
  }, [selectedPair, socket]);

  return (
    <div className="flex items-center gap-3 px-5 py-2">
      <select value={selectedPair} onChange={handleSelectChange}>
        {pairs.map((pair, index) => (
          <option key={index} value={pair.key}>{pair.label}</option>
        ))}
      </select>
    </div>
  );
};

export default PairSelector;
